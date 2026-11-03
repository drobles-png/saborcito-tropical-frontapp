<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useDragToClose } from '@/composables/useDragToClose'
import CartLine from './CartLine.vue'
import CartFooter from './CartFooter.vue'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/checkout'

const cart = useCartStore()
const route = useRoute()
const router = useRouter()
const panel = ref<HTMLElement | null>(null)
const open = computed(() => cart.open)
let returnFocus: HTMLElement | null = null

useBodyScroll(open)
const close = () => (cart.open = false)
const { onPointerDown } = useDragToClose(panel, close)

watch(open, async (v) => {
  if (v) {
    returnFocus = document.activeElement as HTMLElement | null
    await nextTick()
    panel.value?.querySelector<HTMLElement>('.drawer__close')?.focus()
  } else {
    returnFocus?.focus?.()
  }
})
watch(() => route.fullPath, close)

function goCheckout() {
  close()
  router.push('/checkout')
}

// Foco atrapado: Tab no se escapa del panel mientras está abierto.
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') return close()
  if (e.key !== 'Tab' || !panel.value) return
  const items = panel.value.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')
  const first = items[0]
  const last = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last?.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first?.focus()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="drawer" @keydown="onKeydown">
        <div class="drawer__overlay" @click="close"></div>
        <aside ref="panel" class="drawer__panel" role="dialog" aria-modal="true" :aria-label="site.cart.title">
          <header class="drawer__head" @pointerdown="onPointerDown">
            <span class="drawer__grip" aria-hidden="true"></span>
            <h2 class="drawer__title">
              {{ site.cart.title }}
              <span v-if="cart.count" class="drawer__count">{{ cart.count }}</span>
            </h2>
            <button
              type="button"
              class="drawer__close"
              :aria-label="checkoutCopy.cart.close"
              @pointerdown.stop
              @click="close"
            >
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </header>

          <div v-if="cart.isEmpty" class="drawer__empty">
            <div class="drawer__art" aria-hidden="true">
              <img src="/brand/tile-3.webp" alt="" class="drawer__tile drawer__tile--a" />
              <img src="/brand/tile-7.webp" alt="" class="drawer__tile drawer__tile--b" />
              <span class="drawer__bag"><i class="fa-solid fa-bag-shopping"></i></span>
            </div>
            <p>{{ site.cart.empty }}</p>
            <RouterLink to="/menu" class="btn btn--lime" @click="close">{{ site.cart.emptyCta }}</RouterLink>
          </div>

          <template v-else>
            <TransitionGroup tag="ul" name="line" class="drawer__lines">
              <CartLine v-for="line in cart.lines" :key="line.key" :line="line" />
            </TransitionGroup>
            <CartFooter @checkout="goCheckout" />
          </template>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.drawer {
  position: fixed;
  inset: 0;
  z-index: 250;

  &__overlay {
    position: absolute;
    inset: 0;
    background: $overlay;
    backdrop-filter: blur(2px);
  }

  &__panel {
    position: absolute;
    inset: auto 0 0 0;
    height: 88vh;
    height: 88dvh;
    @include flex(column, stretch);
    background: $surface;
    border-radius: $radius-lg $radius-lg 0 0;
    box-shadow: $shadow-lg;
    transition: transform 0.42s $ease;

    @include from('md') {
      inset: 0 0 0 auto;
      width: min(440px, 100vw);
      height: 100%;
      border-radius: $radius-lg 0 0 $radius-lg;
    }
  }

  &__head {
    position: relative;
    @include flex(row, center, space-between);
    padding: 1.4rem 1.25rem 0.8rem;
    border-bottom: 1px solid $line;
    touch-action: none; // el encabezado arrastra el sheet, no la página
    user-select: none;

    @include from('md') {
      padding-top: 1.25rem;
    }
  }

  &__grip {
    position: absolute;
    top: 0.55rem;
    left: 50%;
    width: 44px;
    height: 5px;
    margin-left: -22px;
    border-radius: $radius-pill;
    background: $line;

    @include from('md') {
      display: none;
    }
  }

  &__title {
    @include display($text-xl, 600);
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__count {
    font-size: 0.85rem;
    min-width: 26px;
    height: 26px;
    padding: 0 0.45rem;
    border-radius: $radius-pill;
    background: $lime;
    color: $ink;
    @include flex(row, center, center);
  }

  &__close {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: $sand;
    font-size: 1.1rem;
    transition: transform 0.15s $ease;

    &:active {
      transform: scale(0.9);
    }
  }

  &__lines {
    position: relative;
    flex: 1;
    overflow-y: auto;
    padding: 0 1.25rem;
    overscroll-behavior: contain;
  }

  &__empty {
    flex: 1;
    @include flex(column, center, center, 1.1rem);
    padding: 2rem 1.5rem;
    text-align: center;
    color: $ink-soft;

    p {
      max-width: 26ch;
    }
  }

  &__art {
    position: relative;
    width: 170px;
    height: 150px;
  }

  &__tile {
    position: absolute;
    width: 92px;
    height: auto;
    animation: tile-float 4s ease-in-out infinite alternate;

    &--a {
      left: 0;
      top: 6px;
      rotate: -12deg;
    }

    &--b {
      right: 0;
      bottom: 0;
      rotate: 10deg;
      animation-delay: -2s;
    }
  }

  &__bag {
    position: absolute;
    inset: 32px 45px;
    @include flex(row, center, center);
    border-radius: 50%;
    background: $lime;
    color: $ink;
    font-size: 2rem;
    box-shadow: $shadow-pop;
  }
}

@keyframes tile-float {
  to {
    translate: 0 -8px;
  }
}

// El panel sube (móvil) o entra por la derecha (desktop); sale más rápido de lo que entra.
.drawer-enter-active {
  transition: opacity 0.42s ease;
}
.drawer-leave-active {
  transition: opacity 0.26s ease;

  .drawer__panel {
    transition-duration: 0.26s;
  }
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;

  .drawer__panel {
    transform: translateY(100%);

    @include from('md') {
      transform: translateX(100%);
    }
  }
}

.line-move,
.line-enter-active,
.line-leave-active {
  transition:
    transform 0.32s $ease,
    opacity 0.25s ease;
}
.line-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.line-leave-to {
  opacity: 0;
  transform: translateX(60px);
}
.line-leave-active {
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
}
</style>
