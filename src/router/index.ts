import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'

// meta.layout: 'public' (header + footer + carrito) | 'admin' (panel, sin chrome público) | 'bare'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: site.name },
  },
  {
    path: '/menu',
    name: 'Shop',
    component: () => import('@/views/ShopView.vue'),
    meta: { title: 'Menú' },
  },
  {
    path: '/producto/:slug',
    name: 'Product',
    component: () => import('@/views/ProductView.vue'),
    meta: { title: 'Producto' },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: 'Finaliza tu pedido', hideCartBar: true },
  },
  {
    path: '/pedido',
    name: 'TrackLookup',
    component: () => import('@/views/TrackLookupView.vue'),
    meta: { title: 'Sigue tu pedido' },
  },
  {
    path: '/pedido/:code',
    name: 'OrderTracking',
    component: () => import('@/views/OrderTrackingView.vue'),
    meta: { title: 'Tu pedido', hideCartBar: true },
  },
  {
    path: '/pago/respuesta',
    name: 'PaymentResponse',
    component: () => import('@/views/PaymentResponseView.vue'),
    meta: { title: 'Confirmando pago', hideCartBar: true },
  },

  // ─── Panel de administración ───
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/AdminLoginView.vue'),
    meta: { title: 'Ingresar al panel', layout: 'bare', guestOnly: true },
  },
  {
    path: '/admin',
    component: () => import('@/layout/AdminLayout.vue'),
    meta: { layout: 'admin', requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
        meta: { title: 'Resumen' },
      },
      {
        path: 'pedidos',
        name: 'AdminOrders',
        component: () => import('@/views/admin/AdminOrdersView.vue'),
        meta: { title: 'Pedidos' },
      },
      {
        path: 'pedidos/:id',
        name: 'AdminOrderDetail',
        component: () => import('@/views/admin/AdminOrderDetailView.vue'),
        meta: { title: 'Pedido' },
      },
      {
        path: 'productos',
        name: 'AdminProducts',
        component: () => import('@/views/admin/AdminProductsView.vue'),
        meta: { title: 'Productos' },
      },
      {
        path: 'productos/nuevo',
        name: 'AdminProductNew',
        component: () => import('@/views/admin/AdminProductEditView.vue'),
        meta: { title: 'Nuevo producto' },
      },
      {
        path: 'productos/:id',
        name: 'AdminProductEdit',
        component: () => import('@/views/admin/AdminProductEditView.vue'),
        meta: { title: 'Editar producto' },
      },
      {
        path: 'categorias',
        name: 'AdminCategories',
        component: () => import('@/views/admin/AdminCategoriesView.vue'),
        meta: { title: 'Categorías' },
      },
      {
        path: 'ajustes',
        name: 'AdminSettings',
        component: () => import('@/views/admin/AdminSettingsView.vue'),
        meta: { title: 'Ajustes de la tienda' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Con "atrás" el navegador devuelve la posición guardada; con un hash se
  // baja a la sección; si cambia solo la query (filtro de categoría) no se salta; si no, arriba.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }
    if (to.path === from.path) return false
    return { left: 0, top: 0 }
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth || to.meta.guestOnly) {
    // La sesión se verifica contra el API una sola vez por carga.
    await userStore.restore()
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'AdminLogin', query: { next: to.fullPath }, replace: true }
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    userStore.clear()
    return { name: 'AdminLogin', replace: true }
  }

  if (to.meta.guestOnly && userStore.isAdmin) {
    return { name: 'AdminDashboard', replace: true }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title && title !== site.name ? `${title} · ${site.name}` : `${site.name} · ${site.tagline}`
})

export default router
