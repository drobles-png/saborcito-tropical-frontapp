<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { whatsappLink } from '@/config/site'
import { useCartStore } from '@/stores/cart'
import { useMenu } from '@/composables/useMenu'

const { settings } = useMenu()
const cart = useCartStore()
const route = useRoute()
// La CartBar (móvil) aparece con productos en el carrito y no en checkout/seguimiento.
const lifted = computed(() => cart.count > 0 && !route.meta.hideCartBar)
</script>

<template>
  <Transition name="wa">
    <a
      v-if="settings?.whatsapp"
      :href="whatsappLink(settings.whatsapp)"
      target="_blank"
      rel="noopener"
      class="wa"
      :class="{ 'wa--lifted': lifted }"
      aria-label="Escríbenos por WhatsApp"
    >
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    </a>
  </Transition>
</template>

<style scoped lang="scss">
.wa {
  position: fixed;
  right: 1rem;
  bottom: calc(1rem + env(safe-area-inset-bottom));
  z-index: 80;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #25d366;
  color: $surface;
  font-size: 1.8rem;
  @include flex(row, center, center);
  box-shadow: 0 10px 24px -8px rgba($ink, 0.45);
  transition: transform 0.45s $ease;
  @include focus-ring($ink);

  @media (hover: hover) {
    &:hover {
      transform: scale(1.08) rotate(-8deg);
    }
  }

  &--lifted {
    @include until('md') {
      transform: translateY(-80px);
    }
  }

  @include from('md') {
    right: 1.5rem;
    bottom: 1.5rem;
  }
}

.wa-enter-active {
  transition:
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}
.wa-enter-from {
  transform: scale(0);
  opacity: 0;
}
</style>
