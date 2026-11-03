// Pedidos hechos desde este dispositivo: sin cuentas, el código es la llave del seguimiento.
const KEY = 'st_my_orders'
const PENDING = 'st_pending_code'

export interface MyOrder {
  code: string
  createdAt: string
  total: number // centavos
}

export function myOrders(): MyOrder[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function rememberOrder({ code, createdAt, total }: MyOrder) {
  const list = [{ code, createdAt, total }, ...myOrders().filter((o) => o.code !== code)].slice(0, 10)
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    // modo privado: el código igual se muestra en pantalla
  }
}

/** Código del pedido con tarjeta que está esperando la respuesta de Payphone. */
export const pendingCode = {
  get: () => sessionStorage.getItem(PENDING) || '',
  set: (code: string) => sessionStorage.setItem(PENDING, code),
  clear: () => sessionStorage.removeItem(PENDING),
}

/** "st-7k2q9", "7k2q9" o " ST 7K2Q9 " → "ST-7K2Q9". */
export function normalizeCode(raw: string): string {
  const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const body = clean.startsWith('ST') && clean.length > 5 ? clean.slice(2) : clean
  return body ? `ST-${body}` : ''
}
