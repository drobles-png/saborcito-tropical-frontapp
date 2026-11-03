import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { orderService } from '@/services/order.service'
import type { ApiError, OrderStatus, TrackedOrder } from '@/types'

const POLL_MS = 15000
const FINAL: OrderStatus[] = ['delivered', 'cancelled']

/** Sigue un pedido por código: sondeo cada 15 s, en pausa con la pestaña oculta y al terminar. */
export function useOrderTracking(code: Ref<string>) {
  const order = ref<TrackedOrder | null>(null)
  const loading = ref(true)
  const notFound = ref(false)
  const error = ref('')
  const changed = ref(0) // sube cada vez que el estado cambia en vivo: la vista lo celebra
  let timer: ReturnType<typeof setTimeout> | undefined

  async function fetchOrder() {
    clearTimeout(timer)
    try {
      const next = await orderService.track(code.value)
      if (order.value && order.value.status !== next.status) changed.value++
      order.value = next
      error.value = ''
      notFound.value = false
    } catch (e) {
      const err = e as ApiError
      if (err?.status === 404) notFound.value = true
      else error.value = err?.message || 'error'
    } finally {
      loading.value = false
      schedule()
    }
  }

  function schedule() {
    clearTimeout(timer)
    if (notFound.value || document.hidden || (order.value && FINAL.includes(order.value.status))) return
    timer = setTimeout(fetchOrder, POLL_MS)
  }

  function onVisibility() {
    if (document.hidden) clearTimeout(timer)
    else if (order.value) fetchOrder() // al volver, se pone al día de una vez
  }

  watch(code, () => {
    order.value = null
    loading.value = true
    fetchOrder()
  })
  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibility)
    fetchOrder()
  })
  onBeforeUnmount(() => {
    clearTimeout(timer)
    document.removeEventListener('visibilitychange', onVisibility)
  })

  return { order, loading, notFound, error, changed, refresh: fetchOrder }
}
