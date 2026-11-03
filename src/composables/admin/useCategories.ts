import { onMounted, ref, watch } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { admin } from '@/config/admin'
import { slugify } from './useProductForm'
import type { ApiError, Category } from '@/types'

type Draft = Pick<Category, 'name' | 'slug' | 'icon' | 'tagline' | 'isActive'>
const blank = (): Draft => ({ name: '', slug: '', icon: 'fa-solid fa-utensils', tagline: '', isActive: true })

export function useCategories() {
  const toast = useToastStore()
  const t = admin.categories
  const list = ref<Category[]>([])
  const loading = ref(true)
  const editing = ref<string | null>(null) // id, 'new' o null
  const draft = ref<Draft>(blank())
  const saving = ref(false)
  let slugTouched = false

  const fail = (e: unknown) => toast.error((e as ApiError).message || admin.genericError)

  onMounted(async () => {
    try {
      list.value = (await adminService.categories()).sort((a, b) => a.order - b.order)
    } catch (e) {
      fail(e)
    } finally {
      loading.value = false
    }
  })

  watch(
    () => draft.value.name,
    (name) => {
      if (!slugTouched) draft.value.slug = slugify(name)
    },
  )

  function edit(c: Category | null) {
    editing.value = c ? c.id : 'new'
    const { name, slug, icon, tagline, isActive } = c ?? blank()
    draft.value = { name, slug, icon, tagline, isActive }
    slugTouched = Boolean(c)
  }

  const touchSlug = () => (slugTouched = true)

  async function save() {
    if (draft.value.name.trim().length < 2 || !draft.value.slug) return toast.error(admin.productForm.errors.name)
    saving.value = true
    try {
      if (editing.value === 'new') {
        list.value.push(await adminService.createCategory({ ...draft.value, order: list.value.length }))
      } else {
        const saved = await adminService.updateCategory(editing.value!, draft.value)
        list.value = list.value.map((c) => (c.id === saved.id ? saved : c))
      }
      editing.value = null
      toast.success(t.saved)
    } catch (e) {
      fail(e)
    } finally {
      saving.value = false
    }
  }

  // Subir/bajar: se mueve al instante (la animación FLIP la hace TransitionGroup) y se guarda; si falla, vuelve
  async function move(index: number, dir: -1 | 1) {
    const to = index + dir
    if (to < 0 || to >= list.value.length) return
    const before = [...list.value]
    const next = [...list.value]
    ;[next[index], next[to]] = [next[to]!, next[index]!]
    list.value = next
    try {
      await adminService.reorderCategories(next.map((c) => c.id))
    } catch (e) {
      list.value = before
      fail(e)
    }
  }

  async function remove(c: Category) {
    try {
      await adminService.deleteCategory(c.id)
      list.value = list.value.filter((x) => x.id !== c.id)
      toast.success(t.deleted)
    } catch (e) {
      fail(e) // 409: el API explica que tiene productos
    }
  }

  return { list, loading, editing, draft, saving, edit, touchSlug, save, move, remove }
}
