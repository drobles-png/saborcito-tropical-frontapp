import { computed, ref } from 'vue'
import { menuService } from '@/services/menu.service'
import type { Category, Menu, Product, PublicSettings } from '@/types'

// Estado de módulo: el menú y los ajustes se piden una vez por visita y los comparten
// el home, la tienda, el detalle y el checkout.
const menu = ref<Menu | null>(null)
const settings = ref<PublicSettings | null>(null)
const loading = ref(false)
const error = ref('')
let inflight: Promise<void> | null = null

async function load(force = false) {
  if (inflight) return inflight
  // tras un error solo reintenta reload(): si no, cada useMenu() de la página dispara otra petición
  if (!force && ((menu.value && settings.value) || error.value)) return
  loading.value = true
  error.value = ''
  inflight = Promise.all([menuService.getMenu(), menuService.getSettings()])
    .then(([m, s]) => {
      menu.value = m
      settings.value = s
    })
    .catch((e: { message?: string }) => {
      error.value = e?.message || 'No pudimos cargar el menú'
    })
    .finally(() => {
      loading.value = false
      inflight = null
    })
  return inflight
}

export function useMenu() {
  load()

  const categories = computed<Category[]>(() => menu.value?.categories ?? [])
  const products = computed<Product[]>(() => menu.value?.products ?? [])
  const featured = computed(() => products.value.filter((p) => p.isFeatured))

  function byCategory(categoryId: string): Product[] {
    return products.value.filter((p) => p.category === categoryId)
  }

  function categoryOf(product: Product): Category | undefined {
    return categories.value.find((c) => c.id === product.category)
  }

  return {
    menu,
    settings,
    categories,
    products,
    featured,
    // skeletons mientras no haya datos (no en recargas en segundo plano)
    loading: computed(() => loading.value && !menu.value),
    error,
    reload: () => load(true),
    byCategory,
    categoryOf,
  }
}
