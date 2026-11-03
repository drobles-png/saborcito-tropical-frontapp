import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Header que se compacta al bajar y, en móvil, se esconde al bajar y vuelve al subir.
 * Publica `--header-visible` (px visibles del header) para que otras piezas sticky
 * (la barra de categorías del menú) se peguen justo debajo.
 */
export function useHeaderScroll(el: Ref<HTMLElement | null>, locked: Ref<boolean>) {
  const compact = ref(false)
  const hidden = ref(false)
  let lastY = 0
  let ticking = false
  let height = 0
  const mobile = window.matchMedia('(max-width: 767px)')
  const root = document.documentElement

  function publish() {
    root.style.setProperty('--header-visible', `${hidden.value ? 0 : height}px`)
  }

  function update() {
    ticking = false
    const y = window.scrollY
    compact.value = y > 24
    const delta = y - lastY
    if (locked.value || y < 120) hidden.value = false
    else if (mobile.matches && delta > 6) hidden.value = true
    else if (delta < -6) hidden.value = false
    lastY = y
    publish()
  }

  function onScroll() {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(update)
    }
  }

  const ro = new ResizeObserver(([entry]) => {
    height = Math.round(entry?.borderBoxSize?.[0]?.blockSize ?? el.value?.offsetHeight ?? 0)
    publish()
  })

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    if (el.value) ro.observe(el.value)
    update()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    ro.disconnect()
  })

  return { compact, hidden }
}
