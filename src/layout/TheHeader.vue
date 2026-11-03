<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { home } from '@/config/home'
import { useCartStore } from '@/stores/cart'
import { useMenu } from '@/composables/useMenu'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useHeaderScroll } from '@/composables/useHeaderScroll'
import MobileNav from './MobileNav.vue'
import AnnouncementBar from './AnnouncementBar.vue'

const route = useRoute()
const cart = useCartStore()
const { settings } = useMenu()
const el = ref<HTMLElement | null>(null)
const mobileOpen = ref(false)
const { compact, hidden } = useHeaderScroll(el, mobileOpen)

useBodyScroll(mobileOpen)
watch(() => route.fullPath, () => (mobileOpen.value = false))

</script>

<template>
  <header
    ref="el"
    class="header"
    :class="{ 'header--compact': compact, 'header--hidden': hidden, 'header--open': mobileOpen }"
  >
    <AnnouncementBar :settings="settings" />

    <div class="header__inner">
      <RouterLink to="/" class="header__logo" :aria-label="`${site.name}, inicio`">
        <img src="/brand/logo.png" :alt="site.name" width="1000" height="351" />
      </RouterLink>

      <nav class="header__nav" aria-label="Principal">
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="header__link">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <RouterLink to="/menu" class="btn btn--cta btn--sm header__cta">{{ home.header.order }}</RouterLink>
        <button
          type="button"
          class="header__cart"
          :aria-label="`${home.header.cart} (${cart.count})`"
          data-cart-target
          @click="cart.open = true"
        >
          <i
            :key="`i${cart.bump}`"
            class="fa-solid fa-bag-shopping"
            :class="{ 'header__cart-icon--bump': cart.bump }"
            aria-hidden="true"
          ></i>
          <span v-if="cart.count" :key="`b${cart.bump}`" class="header__badge">{{ cart.count }}</span>
        </button>
        <button
          type="button"
          class="header__burger"
          :aria-label="mobileOpen ? home.header.close : home.header.menu"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-nav"
          @click="mobileOpen = !mobileOpen"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <MobileNav
      :open="mobileOpen"
      :whatsapp="settings?.whatsapp ?? ''"
      :hours="settings?.openingHours ?? ''"
      @close="mobileOpen = false"
    />
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  isolation: isolate;
  transition: transform 0.4s $ease;

  // Fondo en un pseudo: backdrop-filter en el header rompería el position:fixed del menú móvil.
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -2;
    background: rgba($paper, 0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid transparent;
    transition:
      box-shadow 0.3s ease,
      border-color 0.3s ease;
  }

  &--compact::before {
    border-color: $line;
    box-shadow: 0 8px 24px -16px rgba($ink, 0.35);
  }

  &--hidden {
    transform: translateY(-100%);
  }

  &--open::before {
    background: $lime;
  }

  &__inner {
    @include container;
    @include flex(row, center, space-between, 1rem);
    height: 64px;
  }

  &__logo {
    flex-shrink: 0;
    transform-origin: left center;
    transition: transform 0.35s $ease;

    img {
      height: 38px;
      width: auto;

      @include from('md') {
        height: 46px;
      }
    }
  }

  // Sobre el lima del menú abierto, el logo va en su pegatina blanca.
  &--open &__logo {
    background: $surface;
    border-radius: $radius-sm;
    padding: 0.2rem 0.5rem;
  }

  &--compact &__logo {
    transform: scale(0.88);
  }

  &__nav {
    display: none;

    @include from('md') {
      @include flex(row, center, center, 0.25rem);
    }
  }

  &__link {
    position: relative;
    font-family: $font-display;
    font-weight: 600;
    padding: 0.6rem 0.9rem;
    border-radius: $radius-pill;
    transition: background-color 0.2s ease;

    &:hover {
      background: $lime-soft;
    }

    &.router-link-active {
      background: $lime;
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.4rem);
  }

  &__cta {
    display: none;

    @include from('lg') {
      display: inline-flex;
    }
  }

  &__cart {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    @include flex(row, center, center);
    font-size: 1.25rem;
    background: $surface;
    border: 2px solid $ink;
    box-shadow: 0 3px 0 $ink;
    transition: transform 0.15s $ease;
    @include focus-ring($coral-deep);

    &:active {
      transform: translateY(2px);
      box-shadow: 0 1px 0 $ink;
    }
  }

  // :key en cada bump re-monta icono y badge: así la animación vuelve a correr.
  &__cart-icon--bump {
    animation: wiggle 0.5s $ease;
  }

  &__badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: $radius-pill;
    background: $coral-deep;
    color: $surface;
    font-family: $font-display;
    font-weight: 700;
    font-size: 0.75rem;
    line-height: 22px;
    text-align: center;
    animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &__burger {
    width: 48px;
    height: 48px;
    @include flex(column, center, center, 5px);
    @include focus-ring($coral-deep);

    @include from('md') {
      display: none;
    }

    span {
      width: 22px;
      height: 2.5px;
      border-radius: 2px;
      background: $ink;
      transition:
        transform 0.35s $ease,
        opacity 0.2s ease;
    }
  }

  &--open &__burger span {
    &:nth-child(1) {
      transform: translateY(7.5px) rotate(45deg);
    }
    &:nth-child(2) {
      opacity: 0;
    }
    &:nth-child(3) {
      transform: translateY(-7.5px) rotate(-45deg);
    }
  }
}

@keyframes pop {
  0% {
    transform: scale(0.4);
  }
  60% {
    transform: scale(1.35);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes wiggle {
  30% {
    transform: rotate(-14deg) scale(1.15);
  }
  60% {
    transform: rotate(10deg);
  }
}
</style>
