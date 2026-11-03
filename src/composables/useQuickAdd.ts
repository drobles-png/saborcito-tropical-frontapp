import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { flyToCart } from './useFlyToCart'
import { hasRequiredOptions, useProductSheet } from './useProductSheet'
import type { Product } from '@/types'

/** El "+" de las tarjetas: agrega en un toque o, si hay que elegir algo, abre el sheet. */
export function useQuickAdd() {
  const cart = useCartStore()
  const toast = useToastStore()
  const sheet = useProductSheet()

  return async function quickAdd(product: Product, img?: HTMLElement | null) {
    if (!product.isAvailable) return
    if (hasRequiredOptions(product)) return sheet.open(product)
    const landing = flyToCart(img)
    await landing
    cart.add(product, 1)
    toast.show(`${product.name} al carrito`, 'success', 2200)
  }
}
