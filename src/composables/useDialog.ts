import { nextTick, onBeforeUnmount, watch, type Ref } from 'vue'

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Comportamiento de diálogo accesible: Esc cierra, el foco queda atrapado
 * adentro y al cerrar vuelve al elemento que lo abrió.
 */
export function useDialog(open: Ref<boolean>, panel: Ref<HTMLElement | null>, close: () => void) {
  let opener: HTMLElement | null = null

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') return close()
    if (e.key !== 'Tab' || !panel.value) return
    const els = Array.from(panel.value.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (!els.length) return
    const first = els[0]
    const last = els[els.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last?.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first?.focus()
    }
  }

  watch(open, async (isOpen) => {
    if (isOpen) {
      opener = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', onKey)
      await nextTick()
      panel.value?.focus({ preventScroll: true })
    } else {
      document.removeEventListener('keydown', onKey)
      opener?.focus?.({ preventScroll: true })
    }
  })

  onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
}
