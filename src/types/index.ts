/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

// ─── Menú ────────────────────────────────────────────────────────────
// Todos los montos viajan en CENTAVOS (enteros). Se formatean con formatCents().

export interface Category {
  id: string
  name: string
  slug: string
  icon: string // clase de Font Awesome, ej. 'fa-solid fa-burger'
  tagline: string
  order: number
  isActive: boolean
}

export interface OptionChoice {
  label: string
  priceDelta: number // centavos que suma la elección (0 casi siempre)
}

export interface ProductOption {
  name: string // ej. 'Sabor del yogurt', 'Presa'
  required: boolean
  choices: OptionChoice[]
}

export type ProductBadge = 'nuevo' | 'popular' | 'combo' | 'picante'

export interface Product {
  id: string
  name: string
  slug: string
  category: string // id de la categoría
  description: string
  includes: string[] // lo que trae: ['papas pequeñas con queso cheddar', 'cola pequeña']
  price: number // centavos
  image: string // URL absoluta (Cloudinary) o ruta pública '/menu/x.webp'
  badges: ProductBadge[]
  options: ProductOption[]
  isAvailable: boolean // false = "Agotado por hoy"
  isPublished: boolean
  isFeatured: boolean
  order: number
}

export interface Menu {
  categories: Category[]
  products: Product[]
}

// ─── Ajustes de la tienda ───────────────────────────────────────────

export interface Branch {
  name: string
  address: string
  mapsUrl: string
}

export interface PublicSettings {
  storeOpen: boolean
  closedMessage: string
  openingHours: string
  announcement: string // barra superior; vacío = no se muestra
  whatsapp: string // solo dígitos con código de país
  deliveryFee: number // centavos
  freeDeliveryFrom: number // centavos; 0 = nunca gratis
  minOrder: number // centavos
  deliveryEta: string // ej. '30–45 min'
  pickupEta: string // ej. '15–20 min'
  deliveryZones: string // texto: hasta dónde llega el delivery
  branches: Branch[]
  bankInfo: string // datos para transferencia (texto multilínea)
  paymentMethods: { cash: boolean; transfer: boolean; card: boolean } // card solo con token Payphone
}

export interface Settings extends PublicSettings {
  notifyEmail: string
}

// ─── Pedidos ────────────────────────────────────────────────────────

export type Fulfillment = 'delivery' | 'pickup'
export type PaymentMethod = 'cash' | 'transfer' | 'card'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'ready'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled'

/** Línea tal como la arma el carrito y la manda al crear el pedido. */
export interface CartLineInput {
  productId: string
  qty: number
  options: Record<string, string> // { 'Sabor del yogurt': 'Mora' }
  note: string
}

export interface OrderAddress {
  street: string
  reference: string
  lat?: number
  lng?: number
}

export interface CreateOrderInput {
  customer: { name: string; phone: string; email: string }
  fulfillment: Fulfillment
  address: OrderAddress
  branch: string // nombre de la sucursal si es retiro
  items: CartLineInput[]
  paymentMethod: PaymentMethod
  cashChangeFor: number // centavos: "pago con billete de..." (0 = exacto)
  notes: string
}

export interface OrderItem {
  product: string
  name: string
  image: string
  unitPrice: number // centavos, ya con priceDelta de opciones
  qty: number
  options: Array<{ name: string; choice: string; priceDelta: number }>
  note: string
  lineTotal: number
}

export interface Order {
  id: string
  code: string // ej. 'ST-7K2Q9' — público, sirve para seguir el pedido
  customer: { name: string; phone: string; email: string }
  fulfillment: Fulfillment
  address: OrderAddress
  branch: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  cashChangeFor: number
  status: OrderStatus
  statusHistory: Array<{ status: OrderStatus; at: string }>
  notes: string
  createdAt: string
  updatedAt: string
}

/** Respuesta de POST /orders. payphone solo viene si paymentMethod === 'card'. */
export interface CreateOrderResponse {
  order: Order
  payphone?: {
    token: string
    storeId: string
    clientTransactionId: string
    amount: number
    amountWithoutTax: number
    currency: 'USD'
    reference: string
  }
}

/** Vista pública de seguimiento: sin teléfono ni correo. */
export type TrackedOrder = Omit<Order, 'customer'> & {
  customer: { name: string }
}

// ─── Admin ──────────────────────────────────────────────────────────

export interface AdminStats {
  today: { orders: number; sales: number; avgTicket: number }
  pending: number // received + preparing + ready + on_the_way
  last7Days: Array<{ date: string; orders: number; sales: number }>
  topProducts: Array<{ name: string; qty: number; sales: number }>
  byStatus: Record<OrderStatus, number>
}
