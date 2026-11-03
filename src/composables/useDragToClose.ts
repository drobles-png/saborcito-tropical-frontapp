import type { Ref } from 'vue'

/**
 * Bottom-sheet que se cierra arrastrándolo hacia abajo desde su asa.
 * Se suelta: si bajó más de un cuarto de su alto o se lanzó rápido, se cierra; si no, vuelve a su sitio.
 */
export function useDragToClose(sheet: Ref<HTMLElement | null>, close: () => void) {
  let startY = 0
  let lastY = 0
  let lastT = 0
  let velocity = 0

  function move(e: PointerEvent) {
    const el = sheet.value
    if (!el) return
    const dy = Math.max(0, e.clientY - startY)
    velocity = (e.clientY - lastY) / Math.max(1, e.timeStamp - lastT)
    lastY = e.clientY
    lastT = e.timeStamp
    el.style.transform = `translateY(${dy}px)`
  }

  function up(e: PointerEvent) {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
    const el = sheet.value
    if (!el) return
    const dy = e.clientY - startY
    el.style.transition = ''
    if (dy > el.offsetHeight * 0.25 || velocity > 0.6) {
      el.style.transform = 'translateY(100%)' // termina de bajar desde donde quedó el dedo
      close()
    } else {
      el.style.transform = ''
    }
  }

  function onPointerDown(e: PointerEvent) {
    if (!sheet.value || window.matchMedia('(min-width: 768px)').matches) return
    startY = lastY = e.clientY
    lastT = e.timeStamp
    velocity = 0
    sheet.value.style.transition = 'none'
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  return { onPointerDown }
}
