import { ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { admin } from '@/config/admin'
import type { ApiError, Order, OrderStatus } from '@/types'
import { useOrderAlerts } from './useOrderAlerts'

/** Siguiente paso del flujo: received → preparing → ready → (delivery: on_the_way →) delivered. */
export function nextStatus(order: Pick<Order, 'status' | 'fulfillment'>): OrderStatus | null {
  switch (order.status) {
    case 'received':
      return 'preparing'
    case 'preparing':
      return 'ready'
    case 'ready':
      return order.fulfillment === 'delivery' ? 'on_the_way' : 'delivered'
    case 'on_the_way':
      return 'delivered'
    default:
      return null
  }
}

export function nextLabel(order: Pick<Order, 'status' | 'fulfillment'>): string {
  const n = admin.next
  if (order.status === 'ready') return order.fulfillment === 'delivery' ? n.readyDelivery : n.readyPickup
  return (n as Record<string, string>)[order.status] || ''
}

/** Teléfono de Ecuador a formato wa.me: 0991234567 → 593991234567. */
export function waNumber(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.startsWith('593')) return d
  if (d.startsWith('0')) return `593${d.slice(1)}`
  return `593${d}`
}

/**
 * Cambios optimistas sobre el pedido que se le pasa (se muta en sitio).
 * Si el API falla, se restaura la copia y se avisa.
 */
export function useOrderActions() {
  const toast = useToastStore()
  const { refreshBadge } = useOrderAlerts()
  const busy = ref<string | null>(null)

  async function run(order: Order, patch: Partial<Order>, call: () => Promise<Order>) {
    const backup = { status: order.status, paymentStatus: order.paymentStatus, statusHistory: order.statusHistory }
    Object.assign(order, patch)
    busy.value = order.id
    try {
      Object.assign(order, await call())
      refreshBadge()
      return true
    } catch (e) {
      Object.assign(order, backup)
      toast.error((e as ApiError).message || admin.genericError)
      return false
    } finally {
      busy.value = null
    }
  }

  function setStatus(order: Order, status: OrderStatus) {
    return run(order, { status }, () => adminService.setOrderStatus(order.id, status))
  }

  function advance(order: Order) {
    const next = nextStatus(order)
    return next ? setStatus(order, next) : Promise.resolve(false)
  }

  function togglePaid(order: Order) {
    const paymentStatus = order.paymentStatus === 'paid' ? 'pending' : 'paid'
    return run(order, { paymentStatus }, () => adminService.setPaymentStatus(order.id, paymentStatus))
  }

  return { busy, advance, setStatus, togglePaid, cancel: (o: Order) => setStatus(o, 'cancelled') }
}
