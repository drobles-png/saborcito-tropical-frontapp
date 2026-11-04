import { nextTick, onBeforeUnmount, onMounted, watch, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }

export interface MotionConditions {
  motion: boolean // sin prefers-reduced-motion
  desktop: boolean // ≥ 1024 px
  hover: boolean // puntero fino
}

// Un solo refresh para todas las secciones: cada uno recalcula todos los triggers y,
// llamados en ráfaga al cargar, bloqueaban el hilo justo durante la entrada del hero.
let refreshTimer: ReturnType<typeof setTimeout> | undefined
function scheduleRefresh() {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200)
}

// Las secciones que no son el hero esperan a que el navegador quede libre tras la carga
// (tope 1.2 s). Antes todas armaban sus animaciones a la vez con el hero: GSAP leía estilos
// de cientos de elementos mientras Vue pintaba y el iPhone se trababa ~3 s.
let idleGate: Promise<void> | null = null
function afterLoadIdle(): Promise<void> {
  if (!idleGate) {
    idleGate = new Promise((resolve) => {
      const idle = () =>
        'requestIdleCallback' in window
          ? window.requestIdleCallback(() => resolve(), { timeout: 1200 })
          : setTimeout(resolve, 600)
      if (document.readyState === 'complete') idle()
      else window.addEventListener('load', idle, { once: true })
    })
  }
  return idleGate
}

/**
 * Coreografía GSAP con limpieza garantizada: todo lo creado dentro de `setup`
 * vive en un gsap.matchMedia (un contexto) que se revierte al desmontar y se
 * re-ejecuta solo si cambian las condiciones (ej. pasar de móvil a desktop).
 * `ready` permite esperar a que haya datos (el DOM real, no el skeleton).
 * Por defecto la sección se arma recién cuando se acerca a la pantalla; `eager`
 * es solo para lo que se ve al cargar (el hero), que no puede esperar.
 */
export function useGsap(
  scope: Ref<HTMLElement | null>,
  setup: (c: MotionConditions) => void,
  ready: () => boolean = () => true,
  { eager = false }: { eager?: boolean } = {},
) {
  let mm: gsap.MatchMedia | null = null
  let near = eager
  let io: IntersectionObserver | null = null

  function run() {
    mm?.revert()
    mm = null
    if (!scope.value || !ready() || !near) return
    mm = gsap.matchMedia(scope.value)
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 1024px)',
        hover: '(hover: hover) and (pointer: fine)',
      },
      (ctx) => setup(ctx.conditions as unknown as MotionConditions),
    )
    // Las secciones de arriba cambian de alto al cargar datos: recalcular todo.
    scheduleRefresh()
  }

  onMounted(() => {
    watch(ready, (ok) => ok && nextTick(run), { immediate: true })
    if (eager || !scope.value || !('IntersectionObserver' in window)) {
      near = true
      return
    }
    // Se arma media pantalla antes de entrar: el estado inicial (oculto) queda puesto antes de verse.
    io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io?.disconnect()
        afterLoadIdle().then(() => {
          near = true
          if (ready()) run()
        })
      },
      { rootMargin: '60% 0px' },
    )
    io.observe(scope.value)
  })
  onBeforeUnmount(() => {
    io?.disconnect()
    mm?.revert()
  })
}

/** Entrada escalonada al aparecer en pantalla (tarjetas, pasos…). */
export function revealBatch(targets: string, stagger = 0.08) {
  gsap.set(targets, { autoAlpha: 0, y: 40 })
  ScrollTrigger.batch(targets, {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)', stagger, overwrite: true, clearProps: 'transform' }),
  })
}
