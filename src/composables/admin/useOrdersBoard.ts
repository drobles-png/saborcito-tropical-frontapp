import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { admin } from '@/config/admin'
import { useOrderAlerts } from './useOrderAlerts'
import type { ApiError, Order, OrderStatus } from '@/types'

type TabKey = OrderStatus | 'active' | ''
const ACTIVE: OrderStatus[] = ['received', 'preparing', 'ready', 'on_the_way']
const LIMIT = 24

function matches(tab: TabKey, o: Order) {
  if (tab === '') return true
  if (tab === 'active') return ACTIVE.includes(o.status)
  return o.status === tab
}

/** Tablero de cocina: pestañas con contadores, búsqueda, paginación y llegada de pedidos nuevos. */
export function useOrdersBoard() {
  const toast = useToastStore()
  const { arrivals, freshIds, acknowledge } = useOrderAlerts()

  const tab = ref<TabKey>('active')
  const q = ref('')
  const items = ref<Order[]>([])
  const page = ref(1)
  const pages = ref(1)
  const loading = ref(true)
  const loadingMore = ref(false)
  const counts = reactive<Record<string, number>>({})

  // Al avanzar un pedido sale de la pestaña filtrada sin esperar al servidor
  const visible = computed(() => items.value.filter((o) => matches(tab.value, o)))

  async function load(more = false) {
    if (more) loadingMore.value = true
    else loading.value = true
    try {
      const res = await adminService.orders({ status: tab.value, q: q.value.trim(), page: more ? page.value + 1 : 1, limit: LIMIT })
      items.value = more ? [...items.value, ...res.items.filter((o) => !items.value.some((x) => x.id === o.id))] : res.items
      page.value = res.page
      pages.value = res.pages
    } catch (e) {
      toast.error((e as ApiError).message || admin.genericError)
    } finally {
      loading.value = false
      loadingMore.value = false
    }
  }

  async function loadCounts() {
    await Promise.all(
      admin.tabs.map(async ({ key }) => {
        try {
          counts[key] = (await adminService.orders({ status: key, limit: 1 })).total
        } catch {
          /* el contador se queda como estaba */
        }
      }),
    )
  }

  // Pedidos nuevos: se anteponen sin perder lo ya cargado con "Cargar más"
  async function mergeNewest() {
    try {
      const res = await adminService.orders({ status: tab.value, q: q.value.trim(), page: 1, limit: LIMIT })
      const fresh = res.items.filter((o) => !items.value.some((x) => x.id === o.id))
      items.value = [...fresh, ...items.value]
      if (!document.hidden) acknowledge() // ya los está viendo
    } catch {
      /* lo trae el siguiente aviso */
    }
    loadCounts()
  }

  let searchTimer: ReturnType<typeof setTimeout> | undefined
  watch(q, () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => load(), 300)
  })
  watch(tab, () => load())
  watch(arrivals, mergeNewest)

  let countTimer: ReturnType<typeof setTimeout> | undefined
  watch(
    () => items.value.map((o) => o.status).join(),
    () => {
      clearTimeout(countTimer)
      countTimer = setTimeout(loadCounts, 800)
    },
  )

  onMounted(() => {
    acknowledge()
    load()
    loadCounts()
  })

  onUnmounted(() => freshIds.value.clear())

  return { tab, q, visible, loading, loadingMore, counts, freshIds, hasMore: computed(() => page.value < pages.value), load }
}
