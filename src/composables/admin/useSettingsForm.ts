import { computed, onMounted, onUnmounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { admin } from '@/config/admin'
import type { ApiError, Settings } from '@/types'

export function useSettingsForm() {
  const toast = useToastStore()
  const form = ref<Settings | null>(null)
  const saving = ref(false)
  const snapshot = ref('')

  const dirty = computed(() => !!form.value && JSON.stringify(form.value) !== snapshot.value)

  function take(s: Settings) {
    form.value = structuredClone(s)
    snapshot.value = JSON.stringify(form.value)
  }

  onMounted(async () => {
    try {
      take(await adminService.settings())
    } catch (e) {
      toast.error((e as ApiError).message || admin.genericError)
    }
  })

  async function save() {
    if (!form.value) return
    saving.value = true
    try {
      const s = form.value
      take(
        await adminService.updateSettings({
          ...s,
          whatsapp: s.whatsapp.replace(/\D/g, ''),
          branches: s.branches.filter((b) => b.name.trim()),
        }),
      )
      toast.success(admin.settings.saved)
    } catch (e) {
      toast.error((e as ApiError).message || admin.genericError)
    } finally {
      saving.value = false
    }
  }

  const discard = () => form.value && take(JSON.parse(snapshot.value))

  onBeforeRouteLeave(() => !dirty.value || window.confirm(admin.productForm.unsaved))
  const onUnload = (ev: BeforeUnloadEvent) => {
    if (dirty.value) ev.preventDefault()
  }
  onMounted(() => window.addEventListener('beforeunload', onUnload))
  onUnmounted(() => window.removeEventListener('beforeunload', onUnload))

  return { form, saving, dirty, save, discard }
}
