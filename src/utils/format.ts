const money = new Intl.NumberFormat('es-EC', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export function formatMoney(value: number): string {
  return money.format(value)
}

/** El API maneja centavos enteros: 390 → "$3,90". */
export function formatCents(cents: number): string {
  return money.format(cents / 100)
}

/** Partes para pintar el precio estilo menú: "3" grande + "90" en superíndice. */
export function priceParts(cents: number): { whole: string; decimals: string } {
  return { whole: String(Math.floor(cents / 100)), decimals: String(cents % 100).padStart(2, '0') }
}

const date = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatDate(value: string | Date): string {
  return date.format(typeof value === 'string' ? new Date(value) : value)
}

const time = new Intl.DateTimeFormat('es-EC', { hour: '2-digit', minute: '2-digit' })

export function formatTime(value: string | Date): string {
  return time.format(typeof value === 'string' ? new Date(value) : value)
}

/**
 * Las imágenes del seed son rutas públicas del front; las de Cloudinary, absolutas.
 * 'sm' (tarjetas, carrito, miniaturas) pide una versión de 560 px: las fotos originales
 * son de 1200–2048 px y decodificar decenas de ellas trababa el celular al cargar.
 */
export function imageUrl(src: string, size: 'sm' | 'full' = 'full'): string {
  if (!src) return '/brand/icon-192.png'
  if (size === 'full') return src
  if (src.startsWith('/menu/') && !src.startsWith('/menu/sm/')) return src.replace('/menu/', '/menu/sm/')
  if (src.includes('res.cloudinary.com') && src.includes('/upload/')) {
    return src.replace('/upload/', '/upload/w_560,c_limit,f_auto,q_auto/')
  }
  return src
}
