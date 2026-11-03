import APIBase from './httpBase'
import type { CreateOrderInput, CreateOrderResponse, Order, TrackedOrder } from '@/types'

class OrderService extends APIBase {
  async create(input: CreateOrderInput): Promise<CreateOrderResponse> {
    return (await this.post<CreateOrderResponse>('orders', input)).data
  }

  async track(code: string): Promise<TrackedOrder> {
    return (await this.get<TrackedOrder>(`orders/track/${encodeURIComponent(code)}`)).data
  }

  /** Confirma el pago de Payphone. Se llama apenas carga /pago/respuesta. */
  async confirmPayment(id: string, clientTransactionId: string): Promise<{ order: Order }> {
    return (await this.post<{ order: Order }>('orders/confirm', { id, clientTransactionId })).data
  }
}

export const orderService = new OrderService()
