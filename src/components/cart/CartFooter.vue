<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useMenu } from '@/composables/useMenu'
import PriceTag from '@/components/ui/PriceTag.vue'
import { formatCents } from '@/utils/format'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/checkout'

const emit = defineEmits<{ checkout: [] }>()
const cart = useCartStore()
const { settings } = useMenu()
const copy = checkoutCopy.cart

// Una sola barra: primero el mínimo; cumplido, el delivery gratis (si la tienda lo ofrece).
const goal = computed(() => {
  const s = settings.value
  if (!s) return null
  if (s.minOrder > 0 && cart.subtotal < s.minOrder)
    return { kind: 'min', target: s.minOrder, text: copy.minOrder(formatCents(s.minOrder - cart.subtotal)) }
  if (s.freeDeliveryFrom > 0 && cart.subtotal < s.freeDeliveryFrom)
    return { kind: 'free', target: s.freeDeliveryFrom, text: copy.freeDelivery(formatCents(s.freeDeliveryFrom - cart.subtotal)) }
  return null
})
const progress = computed(() => (goal.value ? Math.min(1, cart.subtotal / goal.value.target) : 1))
const hint = computed(() => {
  const s = settings.value
  if (s && s.freeDeliveryFrom > 0 && cart.subtotal >= s.freeDeliveryFrom) return copy.freeDeliveryOk
  if (s?.deliveryFee) return copy.deliveryFee(formatCents(s.deliveryFee))
  return site.cart.deliveryHint
})
const blocked = computed(() => goal.value?.kind === 'min')
</script>

<template>
  <div class="foot">
    <div v-if="goal" class="foot__goal" :class="`foot__goal--${goal.kind}`">
      <p class="foot__goal-text">
        <i :class="goal.kind === 'min' ? 'fa-solid fa-basket-shopping' : 'fa-solid fa-motorcycle'" aria-hidden="true"></i>
        {{ goal.text }}
      </p>
      <div class="foot__bar" role="progressbar" :aria-valuenow="Math.round(progress * 100)" aria-valuemin="0" aria-valuemax="100">
        <span class="foot__fill" :style="{ transform: `scaleX(${progress})` }"></span>
      </div>
    </div>

    <div class="foot__row">
      <span class="foot__label">{{ copy.subtotal }}</span>
      <PriceTag :cents="cart.subtotal" size="md" />
    </div>
    <p class="foot__hint">{{ hint }}</p>

    <button type="button" class="btn btn--cta btn--block foot__cta" :disabled="blocked" @click="emit('checkout')">
      {{ site.cart.checkout }}
      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.foot {
  padding: 1rem 1.25rem calc(1rem + env(safe-area-inset-bottom));
  border-top: 1px solid $line;
  background: $surface;

  &__goal {
    margin-bottom: 0.9rem;
  }

  &__goal-text {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    margin-bottom: 0.4rem;

    i {
      color: $coral-deep;
      margin-right: 0.3rem;
    }
  }

  &__goal--free &__goal-text i {
    color: $lime-deep;
  }

  &__bar {
    height: 8px;
    border-radius: $radius-pill;
    background: $sand;
    overflow: hidden;
  }

  &__fill {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, $lime, $lime-light);
    border-radius: inherit;
    transform-origin: left;
    transition: transform 0.5s $ease;
  }

  &__goal--min &__fill {
    background: linear-gradient(90deg, $coral, #f07a6a);
  }

  &__row {
    @include flex(row, baseline, space-between);
  }

  &__label {
    font-weight: 600;
    color: $ink-soft;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
    margin: 0.2rem 0 0.9rem;
  }

  &__cta {
    min-height: 54px;
    font-size: 1.08rem;
  }
}
</style>
