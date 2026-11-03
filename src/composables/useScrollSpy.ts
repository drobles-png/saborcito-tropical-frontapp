import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

/**
 * Qué sección está "en lectura": la que cruza una franja cerca del tercio
 * superior de la pantalla. Se re-observa cuando cambia la lista de ids.
 */
export function useScrollSpy(ids: Ref<string[]>) {
  const active = ref('')
  let io: IntersectionObserver | null = null

  watch(
    ids,
    (list) => {
      io?.disconnect()
      if (!list.length) return
      io = new IntersectionObserver(
        (entries) => {
          const hit = entries.find((e) => e.isIntersecting)
          if (hit) active.value = hit.target.id
        },
        { rootMargin: '-30% 0px -65% 0px' },
      )
      // Esperar al render de las secciones.
      requestAnimationFrame(() => {
        for (const id of list) {
          const el = document.getElementById(id)
          if (el) io?.observe(el)
        }
      })
      if (!list.includes(active.value)) active.value = list[0] ?? ''
    },
    { immediate: true },
  )

  onBeforeUnmount(() => io?.disconnect())
  return active
}
