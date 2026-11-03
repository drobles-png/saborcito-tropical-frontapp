<script setup lang="ts">
import { ref } from 'vue'
import { gsap, useGsap } from '@/composables/useGsap'
import { home } from '@/config/home'

const root = ref<HTMLElement | null>(null)
const copy = home.notFound

useGsap(root, ({ motion }) => {
  if (!motion) return
  const q = gsap.utils.selector(root.value)
  // Las papas caen de la bandeja… y rebotan.
  gsap
    .timeline()
    .from(q('.nf__digit'), { yPercent: -200, rotation: () => gsap.utils.random(-40, 40), stagger: 0.12, duration: 1, ease: 'bounce.out' })
    .from(q('.nf__food'), { y: -300, rotation: 180, autoAlpha: 0, duration: 1.1, ease: 'bounce.out' }, 0.2)
    .from(q('.nf__copy > *'), { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.5 }, 0.8)
  gsap.to(q('.nf__food'), { rotation: 8, y: -8, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.4 })
})
</script>

<template>
  <section ref="root" class="nf">
    <div class="nf__code" aria-hidden="true">
      <span class="nf__digit">4</span>
      <img src="/cutouts/salchipapa.webp" alt="" width="900" height="887" class="nf__food" />
      <span class="nf__digit">4</span>
    </div>
    <div class="nf__copy">
      <h1 class="nf__title">{{ copy.title }}</h1>
      <p class="nf__script">{{ copy.script }}</p>
      <p class="nf__text">{{ copy.text }}</p>
      <div class="nf__actions">
        <RouterLink to="/menu" class="btn btn--cta">{{ copy.cta }}</RouterLink>
        <RouterLink to="/" class="btn btn--ghost">{{ copy.home }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.nf {
  flex: 1;
  background: $lime;
  overflow: clip;
  @include flex(column, center, center, 1.5rem);
  padding: $space-xl 1.25rem;
  text-align: center;

  &__code {
    @include flex(row, center, center);
  }

  &__digit {
    font-family: $font-display;
    font-weight: 700;
    font-size: clamp(7rem, 3rem + 20vw, 14rem);
    line-height: 0.8;
    color: $ink;
  }

  &__food {
    width: clamp(110px, 8rem + 12vw, 240px);
    height: auto;
    margin-inline: -0.5rem;
    filter: drop-shadow(0 16px 16px rgba($ink, 0.3));
  }

  &__copy {
    @include flex(column, center, flex-start, 0.5rem);
  }

  &__title {
    @include display($display-md, 700);
  }

  &__script {
    @include script($display-sm);
    color: $coral-deep;
    margin-top: -0.3em;
  }

  &__text {
    max-width: 40ch;
    font-weight: 500;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }
}
</style>
