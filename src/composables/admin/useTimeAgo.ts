import { onMounted, onUnmounted, ref } from 'vue'

// Un solo reloj para todas las tarjetas: se enciende con el primer usuario y se apaga con el último.
const now = ref(Date.now())
let users = 0
let timer: ReturnType<typeof setInterval> | undefined

export function timeAgo(iso: string, at = now.value): string {
  const min = Math.max(0, Math.floor((at - new Date(iso).getTime()) / 60000))
  if (min < 1) return 'ahora'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h ${min % 60 ? `${min % 60} min` : ''}`.trim()
  return `hace ${Math.floor(h / 24)} d`
}

/** Minutos transcurridos, para pintar urgencia. */
export function minutesSince(iso: string, at = now.value): number {
  return Math.floor((at - new Date(iso).getTime()) / 60000)
}

export function useNow() {
  onMounted(() => {
    if (users++ === 0) {
      now.value = Date.now()
      timer = setInterval(() => (now.value = Date.now()), 30000)
    }
  })
  onUnmounted(() => {
    if (--users === 0) clearInterval(timer)
  })
  return now
}
