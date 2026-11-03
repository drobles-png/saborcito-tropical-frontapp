<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useMenu } from '@/composables/useMenu'
import { pendingCode } from '@/composables/useMyOrders'
import { orderService } from '@/services/order.service'
import { whatsappLink } from '@/config/site'
import { checkoutCopy } from '@/config/checkout'
import type { ApiError } from '@/types'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const { settings } = useMenu()
const copy = checkoutCopy.paymentResponse
const failed = ref(false)
const reason = ref('')
const code = pendingCode.get()

const helpUrl = computed(() => whatsappLink(settings.value?.whatsapp ?? '', copy.helpMessage(code)))

// Payphone reversa el cobro si no se confirma en 5 minutos: se confirma apenas carga, sin esperar clics.
onMounted(async () => {
  const id = String(route.query.id ?? '')
  const tx = String(route.query.clientTransactionId ?? '')
  if (!id || !tx || id === '0') return (failed.value = true)
  try {
    const { order } = await orderService.confirmPayment(id, tx)
    if (order.paymentStatus !== 'paid') throw { message: '' }
    cart.clear()
    pendingCode.clear()
    router.replace(`/pedido/${order.code}?nuevo=1`)
  } catch (e) {
    reason.value = (e as ApiError)?.message || ''
    failed.value = true
  }
})
</script>

<template>
  <div class="pr">
    <Transition name="rise" mode="out-in">
      <div v-if="!failed" key="wait" class="pr__card" aria-live="polite" aria-busy="true">
        <div class="pr__card-art" aria-hidden="true">
          <i class="fa-solid fa-credit-card"></i>
          <span class="pr__scan"></span>
        </div>
        <h1 class="pr__title">{{ copy.confirming }}</h1>
        <p class="pr__text">{{ copy.confirmingText }}</p>
        <div class="pr__lines" aria-hidden="true">
          <span class="skeleton"></span>
          <span class="skeleton" style="width: 70%"></span>
        </div>
      </div>

      <div v-else key="fail" class="pr__card" role="alert">
        <div class="pr__card-art pr__card-art--fail" aria-hidden="true"><i class="fa-solid fa-xmark"></i></div>
        <h1 class="pr__title">{{ copy.failTitle }}</h1>
        <p class="pr__text">{{ copy.failText }}</p>
        <p v-if="reason" class="pr__reason">{{ reason }}</p>
        <div class="pr__actions">
          <RouterLink to="/checkout" class="btn btn--cta btn--block">{{ copy.retry }}</RouterLink>
          <a :href="helpUrl" target="_blank" rel="noopener" class="btn btn--ghost btn--block">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.help }}
          </a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.pr {
  flex: 1;
  @include flex(column, center, center);
  padding: 2.5rem 1.25rem 4rem;
  background: $paper;

  &__card {
    width: 100%;
    max-width: 420px;
    @include flex(column, center, flex-start, 0.6rem);
    text-align: center;
    padding: 2rem 1.5rem;
    border-radius: $radius-lg;
    background: $surface;
    border: 1px solid $line;
    box-shadow: $shadow-md;
  }

  &__card-art {
    position: relative;
    width: 96px;
    height: 96px;
    border-radius: 28px;
    background: $lime;
    color: $ink;
    font-size: 2.6rem;
    overflow: hidden;
    @include flex(row, center, center);
    margin-bottom: 0.4rem;

    &--fail {
      border-radius: 50%;
      background: $coral-deep;
      color: $surface;
      animation: shake 0.5s $ease;
    }
  }

  // franja de luz que recorre la tarjeta mientras se confirma (sin spinner)
  &__scan {
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, transparent 30%, rgba(#fff, 0.7) 50%, transparent 70%);
    animation: scan 1.4s ease-in-out infinite;
  }

  &__title {
    @include display($text-xl, 700);
  }

  &__text {
    color: $ink-soft;
  }

  &__reason {
    font-size: $text-sm;
    color: $danger;
  }

  &__lines {
    width: 100%;
    @include flex(column, center, flex-start, 0.5rem);
    margin-top: 0.6rem;

    span {
      width: 100%;
      height: 14px;
    }
  }

  &__actions {
    width: 100%;
    @include flex(column, stretch, flex-start, 0.6rem);
    margin-top: 0.8rem;
  }
}

@keyframes scan {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes shake {
  25% {
    transform: translateX(-6px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-3px);
  }
}
</style>
