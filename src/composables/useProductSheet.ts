import { ref } from 'vue'
import type { Product } from '@/types'

// Estado de módulo: un solo sheet global (montado en App.vue) que abre cualquier tarjeta.
const product = ref<Product | null>(null)

export function useProductSheet() {
  return {
    product,
    open: (p: Product) => (product.value = p),
    close: () => (product.value = null),
  }
}

export function hasRequiredOptions(p: Product): boolean {
  return p.options.some((o) => o.required && o.choices.length > 0)
}
