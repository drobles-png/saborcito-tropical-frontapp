import { computed, ref, watch, type Ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { home } from '@/config/home'
import type { Product } from '@/types'

/** Estado del formulario de un producto: opciones elegidas, cantidad, nota y total. */
export function useProductForm(product: Ref<Product | null>) {
  const cart = useCartStore()
  const toast = useToastStore()
  const choices = ref<Record<string, string>>({})
  const qty = ref(1)
  const note = ref('')
  const showErrors = ref(false)

  // Producto nuevo = formulario limpio.
  watch(
    () => product.value?.id,
    () => {
      choices.value = {}
      qty.value = 1
      note.value = ''
      showErrors.value = false
    },
    { immediate: true },
  )

  const missing = computed(() =>
    (product.value?.options ?? []).filter((o) => o.required && o.choices.length && !choices.value[o.name]).map((o) => o.name),
  )

  const unitPrice = computed(() => {
    const p = product.value
    if (!p) return 0
    return p.options.reduce((sum, o) => {
      const c = o.choices.find((x) => x.label === choices.value[o.name])
      return sum + (c?.priceDelta ?? 0)
    }, p.price)
  })

  const total = computed(() => unitPrice.value * qty.value)

  function toggle(option: string, label: string, required: boolean) {
    // Una opcional se puede desmarcar tocándola otra vez; una obligatoria no.
    if (choices.value[option] === label && !required) {
      const next = { ...choices.value }
      delete next[option]
      choices.value = next
    } else choices.value = { ...choices.value, [option]: label }
  }

  /** true si se agregó; false si falta elegir algo (y deja visibles los avisos). */
  function submit(): boolean {
    const p = product.value
    if (!p || !p.isAvailable) return false
    if (missing.value.length) {
      showErrors.value = true
      return false
    }
    cart.add(p, qty.value, { ...choices.value }, note.value)
    toast.show(`${p.name} · ${home.product.added}`, 'success', 2200)
    return true
  }

  return { choices, qty, note, showErrors, missing, unitPrice, total, toggle, submit }
}
