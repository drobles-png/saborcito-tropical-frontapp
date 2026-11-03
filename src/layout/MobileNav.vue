<script setup lang="ts">
import { site, whatsappLink } from '@/config/site'
import { home } from '@/config/home'

defineProps<{ open: boolean; whatsapp: string; hours: string }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <Transition name="mnav">
    <div v-if="open" id="mobile-nav" class="mnav">
      <img src="/brand/tile-4.webp" alt="" class="mnav__tile mnav__tile--a" width="184" height="220" />
      <img src="/brand/tile-7.webp" alt="" class="mnav__tile mnav__tile--b" width="192" height="220" />
      <nav class="mnav__links" aria-label="Menú principal">
        <RouterLink to="/" class="mnav__link" style="--i: 0" @click="$emit('close')">Inicio</RouterLink>
        <RouterLink
          v-for="(link, i) in site.nav"
          :key="link.to"
          :to="link.to"
          class="mnav__link"
          :style="{ '--i': i + 1 }"
          @click="$emit('close')"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
      <div class="mnav__foot" :style="{ '--i': site.nav.length + 1 }">
        <RouterLink to="/menu" class="btn btn--cta btn--block" @click="$emit('close')">{{ home.header.order }}</RouterLink>
        <a v-if="whatsapp" :href="whatsappLink(whatsapp)" target="_blank" rel="noopener" class="btn btn--dark btn--block">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp
        </a>
        <p v-if="hours" class="mnav__hours"><i class="fa-regular fa-clock" aria-hidden="true"></i> {{ hours }}</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.mnav {
  position: fixed;
  inset: 0;
  z-index: -1; // debajo de la barra del header, encima de la página
  background: $lime;
  @include flex(column, stretch, space-between);
  padding: calc(var(--header-visible, 64px) + 1.5rem) 1.5rem calc(1.5rem + env(safe-area-inset-bottom));
  overflow: hidden;
  clip-path: circle(150% at calc(100% - 2.5rem) 2.5rem);

  &__tile {
    position: absolute;
    width: 160px;
    height: auto;
    opacity: 0.35;
    pointer-events: none;

    &--a {
      right: -40px;
      top: 30%;
      transform: rotate(14deg);
    }
    &--b {
      left: -50px;
      bottom: 18%;
      transform: rotate(-10deg);
    }
  }

  &__links {
    position: relative;
    @include flex(column, flex-start, flex-start, 0.25rem);
  }

  &__link {
    @include display(clamp(2.6rem, 12vw, 3.6rem), 700);
    color: $ink;
    padding-block: 0.2rem;
    transition:
      transform 0.5s $ease,
      opacity 0.4s ease;
    transition-delay: calc(0.12s + var(--i) * 0.05s);

    &.router-link-exact-active {
      color: $coral-deep;
    }
  }

  &__foot {
    position: relative;
    @include flex(column, stretch, flex-start, 0.6rem);
    transition:
      transform 0.5s $ease,
      opacity 0.4s ease;
    transition-delay: calc(0.12s + var(--i) * 0.05s);
  }

  &__hours {
    text-align: center;
    font-size: $text-sm;
    font-weight: 600;
  }
}

.mnav-enter-active,
.mnav-leave-active {
  transition: clip-path 0.6s cubic-bezier(0.7, 0, 0.2, 1);
}
.mnav-leave-active {
  transition-duration: 0.4s;
}
.mnav-enter-from,
.mnav-leave-to {
  clip-path: circle(0% at calc(100% - 2.5rem) 2.5rem);

  .mnav__link,
  .mnav__foot {
    transform: translateY(30px);
    opacity: 0;
  }
}
.mnav-leave-active .mnav__link,
.mnav-leave-active .mnav__foot {
  transition-delay: 0s;
}
</style>
