import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { admin } from '@/config/admin'
import type { ApiError, Category, Product } from '@/types'

type Form = Omit<Product, 'id'>

export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const blank = (): Form => ({
  name: '',
  slug: '',
  category: '',
  description: '',
  includes: [],
  price: 0,
  image: '',
  badges: [],
  options: [],
  isAvailable: true,
  isPublished: true,
  isFeatured: false,
  order: 0,
})

/** Estado del formulario de producto: carga, slug automático, validación, guardado y aviso de cambios sin guardar. */
export function useProductForm() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()
  const e = admin.productForm.errors

  const id = computed(() => (route.name === 'AdminProductEdit' ? String(route.params.id) : null))
  const form = ref<Form>(blank())
  const categories = ref<Category[]>([])
  const loading = ref(true)
  const saving = ref(false)
  const uploading = ref(false)
  const errors = ref<Record<string, string>>({})
  const slugTouched = ref(false)
  let snapshot = ''

  const dirty = computed(() => !loading.value && JSON.stringify(form.value) !== snapshot)

  onMounted(async () => {
    try {
      const [cats, products] = await Promise.all([
        adminService.categories(),
        id.value ? adminService.products() : Promise.resolve([] as Product[]),
      ])
      categories.value = cats
      const found = products.find((p) => p.id === id.value)
      if (found) {
        const { id: _omit, ...rest } = found
        form.value = { ...blank(), ...structuredClone(rest) }
        slugTouched.value = true
      } else if (!id.value) {
        form.value.category = String(route.query.category || cats[0]?.id || '')
      } else {
        toast.error(admin.detail.notFound)
      }
    } catch (err) {
      toast.error((err as ApiError).message || admin.genericError)
    } finally {
      snapshot = JSON.stringify(form.value)
      loading.value = false
    }
  })

  // El slug sigue al nombre hasta que alguien lo edita a mano
  watch(
    () => form.value.name,
    (name) => {
      if (!slugTouched.value) form.value.slug = slugify(name)
    },
  )

  function validate(): boolean {
    const f = form.value
    const out: Record<string, string> = {}
    if (f.name.trim().length < 2) out.name = e.name
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.slug)) out.slug = e.slug
    if (!f.category) out.category = e.category
    if (!(f.price > 0)) out.price = e.price
    if (f.options.some((o) => !o.name.trim() || !o.choices.some((c) => c.label.trim()))) out.options = e.options
    errors.value = out
    return !Object.keys(out).length
  }

  async function save() {
    if (!validate()) {
      toast.error(Object.values(errors.value)[0]!)
      return
    }
    saving.value = true
    const payload: Partial<Product> = {
      ...form.value,
      name: form.value.name.trim(),
      includes: form.value.includes.map((s) => s.trim()).filter(Boolean),
      options: form.value.options.map((o) => ({ ...o, choices: o.choices.filter((c) => c.label.trim()) })),
    }
    try {
      const saved = id.value
        ? await adminService.updateProduct(id.value, payload)
        : await adminService.createProduct(payload)
      const { id: newId, ...rest } = saved
      form.value = { ...blank(), ...rest }
      snapshot = JSON.stringify(form.value)
      toast.success(admin.productForm.saved)
      if (!id.value) router.replace({ name: 'AdminProductEdit', params: { id: newId } })
    } catch (err) {
      toast.error((err as ApiError).message || admin.genericError)
    } finally {
      saving.value = false
    }
  }

  async function remove() {
    if (!id.value) return
    try {
      await adminService.deleteProduct(id.value)
      snapshot = JSON.stringify(form.value)
      toast.success(admin.productForm.deleted)
      router.replace({ name: 'AdminProducts' })
    } catch (err) {
      toast.error((err as ApiError).message || admin.genericError)
    }
  }

  // Aviso de cambios sin guardar: al navegar dentro de la app y al cerrar la pestaña
  onBeforeRouteLeave(() => !dirty.value || window.confirm(admin.productForm.unsaved))
  const onUnload = (ev: BeforeUnloadEvent) => {
    if (dirty.value) ev.preventDefault()
  }
  onMounted(() => window.addEventListener('beforeunload', onUnload))
  onUnmounted(() => window.removeEventListener('beforeunload', onUnload))

  return { id, form, categories, loading, saving, uploading, errors, slugTouched, dirty, save, remove }
}
