<script setup lang="ts">
import { computed } from 'vue'
import { useMenu } from '@/composables/useMenu'
import { useCheckout } from '@/composables/useCheckout'
import { formatCents } from '@/utils/format'
import { checkoutCopy } from '@/config/checkout'

const { settings } = useMenu()
const { form, total, complete, blocked, missingMin, submitting, apiError, submit } = useCheckout()
const copy = checkoutCopy.checkout

const label = computed(() => {
  if (submitting.value) return copy.sending
  const amount = formatCents(total.value)
  return form.paymentMethod === 'card' ? copy.payCard(amount) : copy.submit(amount)
})
const note = computed(() => {
  if (!settings.value?.storeOpen) return settings.value?.closedMessage || copy.closedTitle
  if (missingMin.value > 0) return copy.minOrder(formatCents(missingMin.value))
  if (apiError.value) return apiError.value
  return complete.value ? '' : copy.missing
})
</script>

<template>
  <div class="submit">
    <p v-if="note" class="submit__note" :class="{ 'submit__note--error': apiError || blocked }" aria-live="polite">
      {{ note }}
    </p>
    <button
      type="button"
      class="btn btn--cta btn--block submit__btn"
      :class="{ 'submit__btn--busy': submitting }"
      :disabled="blocked"
      :aria-disabled="submitting"
      @click="submit"
    >
      <span class="submit__label">{{ label }}</span>
      <i v-if="!submitting" class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      <span v-else class="submit__progress" aria-hidden="true"></span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.submit {
  // Móvil: barra fija abajo, siempre a mano con el total.
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 150;
  padding: 0.6rem 0.9rem calc(0.75rem + env(safe-area-inset-bottom));
  background: rgba($surface, 0.96);
  backdrop-filter: blur(10px);
  border-top: 1px solid $line;
  box-shadow: 0 -10px 30px -16px rgba($ink, 0.3);
  animation: submit-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  @include from('lg') {
    position: static;
    padding: 0;
    background: none;
    backdrop-filter: none;
    border: 0;
    box-shadow: none;
    animation: none;
    margin-top: 1rem;
  }

  &__note {
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-soft;
    text-align: center;
    margin-bottom: 0.45rem;

    &--error {
      color: $danger;
    }
  }

  &__btn {
    position: relative;
    overflow: hidden;
    min-height: 56px;
    font-size: 1.08rem;

    &--busy {
      pointer-events: none;
    }
  }

  // carga sin spinner: una franja de luz que recorre la base del botón
  &__progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 4px;
    background: rgba(#fff, 0.25);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      width: 40%;
      background: $lime;
      border-radius: $radius-pill;
      animation: submit-bar 1.1s $ease infinite;
    }
  }
}

@keyframes submit-bar {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(260%);
  }
}

@keyframes submit-in {
  from {
    transform: translateY(100%);
  }
}
</style>
