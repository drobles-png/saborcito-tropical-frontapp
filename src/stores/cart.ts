import { defineStore } from 'pinia'
import type { CartLineInput, Product } from '@/types'

const STORAGE_KEY = 'st_cart_v1'

/** Línea del carrito: lo que se manda al API + lo necesario para pintarla sin pedir el menú. */
export interface CartLine extends CartLineInput {
  key: string
  name: string
  image: string
  unitPrice: number // centavos con los priceDelta de las opciones
}

function lineKey(productId: string, options: Record<string, string>, note: string): string {
  const opts = Object.keys(options)
    .sort()
    .map((k) => `${k}=${options[k]}`)
    .join('|')
  return `${productId}::${opts}::${note.trim()}`
}

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: load(),
    open: false, // drawer del carrito
    bump: 0, // se incrementa en cada "agregar": el icono del carrito lo escucha para rebotar
  }),

  getters: {
    count: (s) => s.lines.reduce((n, l) => n + l.qty, 0),
    subtotal: (s) => s.lines.reduce((n, l) => n + l.unitPrice * l.qty, 0),
    isEmpty: (s) => s.lines.length === 0,
    /** Payload listo para POST /orders. */
    items: (s): CartLineInput[] =>
      s.lines.map(({ productId, qty, options, note }) => ({ productId, qty, options, note })),
  },

  actions: {
    add(product: Product, qty = 1, options: Record<string, string> = {}, note = '') {
      const key = lineKey(product.id, options, note)
      const existing = this.lines.find((l) => l.key === key)
      if (existing) {
        existing.qty = Math.min(existing.qty + qty, 50)
      } else {
        const delta = product.options.reduce((sum, opt) => {
          const choice = opt.choices.find((c) => c.label === options[opt.name])
          return sum + (choice?.priceDelta ?? 0)
        }, 0)
        this.lines.push({
          key,
          productId: product.id,
          name: product.name,
          image: product.image,
          unitPrice: product.price + delta,
          qty,
          options,
          note: note.trim(),
        })
      }
      this.bump++
      this.persist()
    },

    setQty(key: string, qty: number) {
      const line = this.lines.find((l) => l.key === key)
      if (!line) return
      if (qty <= 0) this.remove(key)
      else {
        line.qty = Math.min(qty, 50)
        this.persist()
      }
    },

    remove(key: string) {
      this.lines = this.lines.filter((l) => l.key !== key)
      this.persist()
    },

    clear() {
      this.lines = []
      this.persist()
    },

    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.lines))
      } catch {
        // Modo privado: el carrito vive lo que dure la pestaña.
      }
    },
  },
})
