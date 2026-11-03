<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCartStore } from '@/stores/cart'
import PriceTag from '@/components/ui/PriceTag.vue'
import { checkoutCopy } from '@/config/checkout'

const cart = useCartStore()
const copy = checkoutCopy.cart
const bouncing = ref(false)

// Cada "agregar" reinicia el rebote (la clase se quita y se vuelve a poner en el siguiente frame).
watch(
  () => cart.bump,
  () => {
    bouncing.value = false
    requestAnimationFrame(() => (bouncing.value = true))
  },
)
</script>

<template>
  <Transition name="bar">
    <div v-if="cart.count > 0" class="cartbar">
      <div class="cartbar__spacer" aria-hidden="true"></div>
      <button
        type="button"
        class="cartbar__btn"
        :class="{ 'cartbar__btn--bump': bouncing }"
        :aria-label="`${copy.bar}: ${copy.items(cart.count)}`"
        @click="cart.open = true"
        @animationend="bouncing = false"
      >
        <span class="cartbar__icon" data-cart-target>
          <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
          <Transition name="count" mode="out-in">
            <span :key="cart.count" class="cartbar__count">{{ cart.count }}</span>
          </Transition>
        </span>
        <span class="cartbar__label">{{ copy.bar }}</span>
        <PriceTag :cents="cart.subtotal" size="sm" class="cartbar__total" />
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.cartbar {
  @include from('md') {
    display: none;
  }

  // Ocupa en el flujo el alto de la barra: el final del footer no queda tapado.
  &__spacer {
    height: calc(84px + env(safe-area-inset-bottom));
  }

  &__btn {
    position: fixed;
    left: 0.75rem;
    right: 0.75rem;
    bottom: calc(0.75rem + env(safe-area-inset-bottom));
    z-index: 150;
    height: 64px;
    @include flex(row, center, flex-start, 0.8rem);
    padding: 0 1.1rem 0 0.6rem;
    border-radius: $radius-pill;
    background: $cta;
    color: $surface;
    box-shadow:
      0 14px 30px -12px rgba($coral-deep, 0.75),
      $shadow-md;
    transition: transform 0.18s $ease;
    -webkit-tap-highlight-color: transparent;
    user-select: none;

    &:active {
      transform: scale(0.97);
    }

    &--bump .cartbar__icon {
      animation: bag-bump 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }

  &__icon {
    position: relative;
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
    border-radius: 50%;
    background: $surface;
    color: $cta;
    font-size: 1.2rem;
    @include flex(row, center, center);
  }

  &__count {
    position: absolute;
    top: -4px;
    right: -6px;
    min-width: 22px;
    height: 22px;
    padding: 0 0.35rem;
    border-radius: $radius-pill;
    background: $lime;
    color: $ink;
    font-family: $font-display;
    font-weight: 700;
    font-size: 0.78rem;
    line-height: 22px;
    text-align: center;
  }

  &__label {
    flex: 1;
    text-align: left;
    font-family: $font-display;
    font-weight: 600;
    font-size: 1.08rem;
  }
}

@keyframes bag-bump {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.22) rotate(-8deg);
  }
  70% {
    transform: scale(0.94) rotate(4deg);
  }
  100% {
    transform: scale(1);
  }
}

// Entra con resorte desde abajo; sale rápido.
.bar-enter-active .cartbar__btn {
  transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bar-leave-active .cartbar__btn {
  transition: transform 0.22s ease-in;
}
.bar-enter-active,
.bar-leave-active {
  transition: opacity 0.55s;
}
.bar-enter-from .cartbar__btn,
.bar-leave-to .cartbar__btn {
  transform: translateY(140%);
}

.count-enter-active,
.count-leave-active {
  transition:
    transform 0.2s $ease,
    opacity 0.15s ease;
}
.count-enter-from {
  transform: scale(0.4);
  opacity: 0;
}
.count-leave-to {
  transform: scale(1.4);
  opacity: 0;
}
</style>
