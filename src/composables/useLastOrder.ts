import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { useMenu } from '@/composables/useMenu'
import { myOrders } from '@/composables/useMyOrders'
import type { TrackedOrder } from '@/types'

// Estado de módulo: el último pedido de este dispositivo se consulta una vez por visita.
const last = ref<TrackedOrder | null>(null)
let fetched = false

async function load() {
  if (fetched) return
  fetched = true
  const code = myOrders()[0]?.code
  if (!code) return
  try {
    last.value = await orderService.track(code)
  } catch {
    // pedido borrado o sin red: simplemente no se ofrece repetir
  }
}

const DONE = ['delivered', 'cancelled']

export function useLastOrder() {
  load()
  const router = useRouter()
  const cart = useCartStore()
  const toast = useToastStore()
  const { products } = useMenu()

  const active = computed(() => (last.value && !DONE.includes(last.value.status) ? last.value : null))

  /** Vuelve a armar el carrito con lo que sigue disponible y lleva directo a pagar. */
  function reorder(order: TrackedOrder | null = last.value): number {
    if (!order) return 0
    let added = 0
    for (const item of order.items) {
      const product = products.value.find((p) => p.id === item.product)
      if (!product || !product.isAvailable) continue
      const options = Object.fromEntries(item.options.map((o) => [o.name, o.choice]))
      // una opción que ya no existe en el producto obliga a elegir de nuevo: se salta
      const valid = product.options.every(
        (opt) => !opt.required || opt.choices.some((c) => c.label === options[opt.name]),
      )
      if (!valid) continue
      cart.add(product, item.qty, options, item.note)
      added++
    }
    if (!added) {
      toast.error('Lo de tu último pedido no está disponible hoy. Elige algo del menú.')
      return 0
    }
    if (added < order.items.length) toast.info('Agregamos lo que está disponible hoy.')
    router.push('/checkout')
    return added
  }

  return { last, active, reorder }
}
