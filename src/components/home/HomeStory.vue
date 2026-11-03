<script setup lang="ts">
import { ref } from 'vue'
import { gsap, useGsap } from '@/composables/useGsap'
import { site } from '@/config/site'
import { home } from '@/config/home'

const root = ref<HTMLElement | null>(null)
const copy = site.sections.story
const years = ref(20) // sin JS / con reduced-motion se ve el número final

useGsap(root, ({ motion }) => {
  if (!motion) return
  const q = gsap.utils.selector(root)
  const counter = { v: 0 }
  years.value = 0
  gsap
    .timeline({ scrollTrigger: { trigger: root.value, start: 'top 70%', once: true } })
    .to(counter, { v: 20, duration: 1.8, ease: 'power3.out', onUpdate: () => (years.value = Math.round(counter.v)) })
    .from(q('.story__badge'), { scale: 0.6, rotation: -20, duration: 1.2, ease: 'elastic.out(1, 0.5)' }, 0)
    .from(q('.story__copy > *'), { y: 30, autoAlpha: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out' }, 0.2)
  gsap.to(q('.story__tile'), {
    rotation: (i: number) => (i % 2 ? 40 : -40),
    yPercent: -40,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
  })
})
</script>

<template>
  <section ref="root" class="story">
    <img src="/brand/tile-2.webp" alt="" width="184" height="220" class="story__tile story__tile--a" loading="lazy" />
    <img src="/brand/tile-8.webp" alt="" width="185" height="220" class="story__tile story__tile--b" loading="lazy" />
    <div class="story__inner">
      <div class="story__badge" aria-hidden="true">
        <span class="story__num">{{ years }}</span>
        <span class="story__label">{{ home.story.counterLabel }}</span>
      </div>
      <div class="story__copy">
        <p class="story__eyebrow">{{ copy.eyebrow }}</p>
        <h2 class="story__title">{{ copy.title }}</h2>
        <p class="story__text">{{ copy.text }}</p>
        <p class="story__since">{{ home.story.since }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.story {
  position: relative;
  overflow: clip;
  background: $coral-soft;

  &__tile {
    position: absolute;
    width: clamp(90px, 14vw, 180px);
    height: auto;
    opacity: 0.85;

    &--a {
      left: -30px;
      top: 12%;
    }
    &--b {
      right: -24px;
      bottom: 6%;
    }
  }

  &__inner {
    position: relative;
    @include container(1040px);
    @include flex(column, center, flex-start, 2rem);
    padding-block: $space-section;

    @include from('md') {
      flex-direction: row;
      gap: 4rem;
    }
  }

  &__badge {
    flex-shrink: 0;
    @include flex(column, center, center);
    width: clamp(200px, 40vw, 300px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: $coral-deep;
    color: $surface;
    box-shadow: 0 10px 0 $ink;
    transform: rotate(-6deg);
  }

  &__num {
    font-family: $font-display;
    font-weight: 700;
    font-size: clamp(6rem, 3rem + 10vw, 9.5rem);
    line-height: 0.85;
    font-variant-numeric: tabular-nums;
  }

  &__label {
    @include script($display-sm);
    color: $lime;
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 0.75rem);
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md, 700);
  }

  &__text {
    font-size: $text-lg;
    color: $ink-soft;
  }

  &__since {
    font-family: $font-display;
    font-weight: 600;
    color: $coral-deep;
  }
}
</style>
