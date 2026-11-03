import APIBase from './httpBase'
import type {
  AdminStats,
  Category,
  Order,
  OrderStatus,
  Paginated,
  PaymentStatus,
  Product,
  Settings,
} from '@/types'

export interface OrderFilters {
  status?: OrderStatus | 'active' | ''
  q?: string
  page?: number
  limit?: number
  since?: string // ISO: solo pedidos creados después (para avisar pedidos nuevos)
}

class AdminService extends APIBase {
  async stats(): Promise<AdminStats> {
    return (await this.get<AdminStats>('admin/stats')).data
  }

  async orders(filters: OrderFilters = {}): Promise<Paginated<Order>> {
    const qs = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') qs.set(k, String(v))
    })
    return (await this.get<Paginated<Order>>(`admin/orders?${qs}`)).data
  }

  async order(id: string): Promise<Order> {
    return (await this.get<Order>(`admin/orders/${id}`)).data
  }

  async setOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    return (await this.patch<Order>(`admin/orders/${id}/status`, { status })).data
  }

  async setPaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order> {
    return (await this.patch<Order>(`admin/orders/${id}/payment`, { paymentStatus })).data
  }

  async products(): Promise<Product[]> {
    return (await this.get<Product[]>('admin/products')).data
  }

  async createProduct(input: Partial<Product>): Promise<Product> {
    return (await this.post<Product>('admin/products', input)).data
  }

  async updateProduct(id: string, input: Partial<Product>): Promise<Product> {
    return (await this.put<Product>(`admin/products/${id}`, input)).data
  }

  async deleteProduct(id: string): Promise<void> {
    await this.delete(`admin/products/${id}`)
  }

  async categories(): Promise<Category[]> {
    return (await this.get<Category[]>('admin/categories')).data
  }

  async createCategory(input: Partial<Category>): Promise<Category> {
    return (await this.post<Category>('admin/categories', input)).data
  }

  async updateCategory(id: string, input: Partial<Category>): Promise<Category> {
    return (await this.put<Category>(`admin/categories/${id}`, input)).data
  }

  async deleteCategory(id: string): Promise<void> {
    await this.delete(`admin/categories/${id}`)
  }

  /** ids en el orden nuevo. */
  async reorderCategories(ids: string[]): Promise<Category[]> {
    return (await this.put<Category[]>('admin/categories/reorder', { ids })).data
  }

  async settings(): Promise<Settings> {
    return (await this.get<Settings>('admin/settings')).data
  }

  async updateSettings(input: Partial<Settings>): Promise<Settings> {
    return (await this.put<Settings>('admin/settings', input)).data
  }

  /** Sube una imagen a Cloudinary vía backend. Campo multipart: 'file'. */
  async uploadImage(file: File): Promise<{ url: string }> {
    const form = new FormData()
    form.append('file', file)
    return (
      await this.post<{ url: string }>('admin/uploads/image', form, undefined, { timeout: 60000 })
    ).data
  }
}

export const adminService = new AdminService()
