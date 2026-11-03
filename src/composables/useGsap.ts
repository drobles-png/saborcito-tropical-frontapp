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

/**
 * Coreografía GSAP con limpieza garantizada: todo lo creado dentro de `setup`
 * vive en un gsap.matchMedia (un contexto) que se revierte al desmontar y se
 * re-ejecuta solo si cambian las condiciones (ej. pasar de móvil a desktop).
 * `ready` permite esperar a que haya datos (el DOM real, no el skeleton).
 */
export function useGsap(
  scope: Ref<HTMLElement | null>,
  setup: (c: MotionConditions) => void,
  ready: () => boolean = () => true,
) {
  let mm: gsap.MatchMedia | null = null

  function run() {
    mm?.revert()
    mm = null
    if (!scope.value || !ready()) return
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
    ScrollTrigger.refresh()
  }

  onMounted(() => {
    watch(ready, (ok) => ok && nextTick(run), { immediate: true })
  })
  onBeforeUnmount(() => mm?.revert())
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
