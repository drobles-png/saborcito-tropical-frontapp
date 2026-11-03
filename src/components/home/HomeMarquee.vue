<script setup lang="ts">
import { ref } from 'vue'
import { gsap, useGsap } from '@/composables/useGsap'
import { site } from '@/config/site'

const root = ref<HTMLElement | null>(null)
const words = site.marquee
const tileFor = (i: number) => `/brand/tile-${(i % 10) + 1}.webp`

// Velocidad constante: acelerar e invertir con el scroll daba tirones con la inercia del iPhone.
useGsap(root, ({ motion }) => {
  if (!motion) return
  const q = gsap.utils.selector(root.value)
  // La pista está duplicada: mover -50% y repetir = cinta infinita sin costura.
  gsap.to(q('.mq__band--front .mq__track'), { xPercent: -50, duration: 32, ease: 'none', repeat: -1, force3D: true })
})
</script>

<template>
  <section ref="root" class="mq" aria-label="Lo que se te antoja">
    <div class="mq__band mq__band--front">
      <ul class="mq__track">
        <template v-for="copy in 2" :key="copy">
          <li v-for="(w, i) in words" :key="`${copy}${w}`" class="mq__item" :aria-hidden="copy === 2 ? 'true' : undefined">
            {{ w }}
            <img :src="tileFor(i)" alt="" width="190" height="220" loading="lazy" />
          </li>
        </template>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.mq {
  position: relative;
  overflow: clip;
  padding-block: 2.5rem;
  margin-block: -1.25rem;
  z-index: 2;

  &__band {
    overflow: hidden;
    padding-block: 0.8rem;

    &--front {
      position: relative;
      background: $ink;
      transform: rotate(-3deg) scale(1.08);
      box-shadow: 0 14px 30px -14px rgba($ink, 0.5);
    }
  }

  &__track {
    list-style: none;
    @include flex(row, center, flex-start, 1.5rem);
    width: max-content;
    padding-right: 1.5rem; // mismo gap al final: la costura del loop no se nota
    will-change: transform;
  }

  &__item {
    @include flex(row, center, flex-start, 1.5rem);
    font-family: $font-display;
    font-weight: 700;
    font-size: clamp(1.8rem, 1.2rem + 3vw, 3.4rem);
    line-height: 1;
    white-space: nowrap;
    color: $surface;
    text-transform: uppercase;

    img {
      height: 1.2em;
      width: auto;
    }
  }
}
</style>
