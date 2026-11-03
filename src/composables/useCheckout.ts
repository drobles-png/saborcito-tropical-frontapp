import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useMenu } from '@/composables/useMenu'
import { useToastStore } from '@/stores/toast'
import { orderService } from '@/services/order.service'
import { pendingCode, rememberOrder } from '@/composables/useMyOrders'
import { checkoutCopy } from '@/config/checkout'
import type { ApiError, CreateOrderInput, CreateOrderResponse, Fulfillment, PaymentMethod } from '@/types'

const SAVED_KEY = 'st_checkout_customer'
const copy = checkoutCopy.checkout

// Estado de módulo: las secciones del checkout son componentes hermanos y comparten el formulario.
const form = reactive({
  fulfillment: '' as Fulfillment | '',
  name: '',
  phone: '', // solo dígitos: 0991234567
  email: '',
  street: '',
  reference: '',
  lat: undefined as number | undefined,
  lng: undefined as number | undefined,
  branch: '',
  paymentMethod: '' as PaymentMethod | '',
  cashChangeFor: null as number | null, // null = no dijo; 0 = exacto
  notes: '',
})
const touched = reactive<Record<string, boolean>>({})
const showAll = ref(false) // tras intentar enviar, se muestran todos los errores
const submitting = ref(false)
const apiError = ref('')
const usedSaved = ref(false)
const payphone = ref<CreateOrderResponse['payphone'] | null>(null)
const payphoneCode = ref('')
let restored = false

/** Cualquier cosa que escriba la gente → 10 dígitos que empiezan con 09. */
export function cleanPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('593')) digits = `0${digits.slice(3)}`
  if (digits.startsWith('9')) digits = `0${digits}`
  return digits.slice(0, 10)
}

/** 0991234567 → "0991 234 567" */
export function maskPhone(digits: string): string {
  return [digits.slice(0, 4), digits.slice(4, 7), digits.slice(7)].filter(Boolean).join(' ')
}

function restore() {
  if (restored) return
  restored = true
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || 'null')
    if (!saved?.name) return
    Object.assign(form, {
      name: saved.name || '',
      phone: saved.phone || '',
      email: saved.email || '',
      street: saved.street || '',
      reference: saved.reference || '',
    })
    usedSaved.value = true
  } catch {
    // datos corruptos: se piden de nuevo
  }
}

function save() {
  const { name, phone, email, street, reference } = form
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify({ name, phone, email, street, reference }))
  } catch {
    // modo privado
  }
}

function forget() {
  localStorage.removeItem(SAVED_KEY)
  Object.assign(form, { name: '', phone: '', email: '', street: '', reference: '', lat: undefined, lng: undefined })
  usedSaved.value = false
}

export function useCheckout() {
  restore()
  const cart = useCartStore()
  const { settings } = useMenu()
  const router = useRouter()
  const toast = useToastStore()

  const errors = computed(() => ({
    name: form.name.trim().length < 2 ? copy.errors.name : '',
    phone: /^09\d{8}$/.test(form.phone) ? '' : copy.errors.phone,
    email: !form.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()) ? '' : copy.errors.email,
    street: form.street.trim().length < 4 ? copy.errors.street : '',
  }))

  function errorOf(field: keyof typeof errors.value): string {
    return touched[field] || showAll.value ? errors.value[field] : ''
  }

  const deliveryFee = computed(() => {
    const s = settings.value
    if (!s || form.fulfillment !== 'delivery') return 0
    return s.freeDeliveryFrom > 0 && cart.subtotal >= s.freeDeliveryFrom ? 0 : s.deliveryFee
  })
  const total = computed(() => cart.subtotal + deliveryFee.value)
  const missingMin = computed(() => Math.max(0, (settings.value?.minOrder ?? 0) - cart.subtotal))

  const done = computed(() => ({
    fulfillment: !!form.fulfillment,
    customer: !errors.value.name && !errors.value.phone && !errors.value.email,
    place: form.fulfillment === 'pickup' ? !!form.branch : form.fulfillment === 'delivery' && !errors.value.street,
    payment: !!form.paymentMethod,
  }))
  const complete = computed(() => Object.values(done.value).every(Boolean))
  const blocked = computed(() => !settings.value?.storeOpen || cart.isEmpty || missingMin.value > 0)

  function payload(): CreateOrderInput {
    const delivery = form.fulfillment === 'delivery'
    return {
      customer: { name: form.name.trim(), phone: form.phone, email: form.email.trim() },
      fulfillment: form.fulfillment as Fulfillment,
      address: delivery
        ? { street: form.street.trim(), reference: form.reference.trim(), lat: form.lat, lng: form.lng }
        : { street: '', reference: '' },
      branch: delivery ? '' : form.branch,
      items: cart.items,
      paymentMethod: form.paymentMethod as PaymentMethod,
      cashChangeFor: form.paymentMethod === 'cash' ? (form.cashChangeFor ?? 0) : 0,
      notes: form.notes.trim(),
    }
  }

  async function submit() {
    if (submitting.value || blocked.value) return
    showAll.value = true
    if (!complete.value) {
      const first = Object.entries(done.value).find(([, ok]) => !ok)?.[0]
      document.getElementById(`paso-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    submitting.value = true
    apiError.value = ''
    try {
      const res = await orderService.create(payload())
      const { code, createdAt, total } = res.order
      save()
      rememberOrder({ code, createdAt, total })
      if (res.payphone) {
        // El carrito se vacía recién cuando Payphone confirma (PaymentResponseView).
        pendingCode.set(code)
        payphoneCode.value = code
        payphone.value = res.payphone
        return
      }
      cart.clear()
      showAll.value = false
      router.push(`/pedido/${code}?nuevo=1`)
    } catch (e) {
      apiError.value = (e as ApiError)?.message || copy.errorFallback
      toast.error(apiError.value)
    } finally {
      submitting.value = false
    }
  }

  return {
    form,
    touched,
    errorOf,
    done,
    complete,
    blocked,
    deliveryFee,
    total,
    missingMin,
    submitting,
    apiError,
    usedSaved,
    forget,
    submit,
    payphone,
    payphoneCode,
    closePayphone: () => (payphone.value = null),
  }
}
