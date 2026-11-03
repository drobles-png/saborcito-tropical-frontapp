<script setup lang="ts">
import { ref } from 'vue'
import SectionHead from './SectionHead.vue'
import { gsap, useGsap } from '@/composables/useGsap'
import { site } from '@/config/site'

const root = ref<HTMLElement | null>(null)
const copy = site.sections.how

useGsap(root, ({ motion }) => {
  if (!motion) return
  const q = gsap.utils.selector(root.value)
  const tl = gsap.timeline({ scrollTrigger: { trigger: q('.how__steps')[0], start: 'top 80%', once: true } })
  tl.from(q('.how__step'), { y: 60, autoAlpha: 0, stagger: 0.15, duration: 0.7, ease: 'back.out(1.6)' })
    .from(q('.how__num'), { scale: 0, rotation: -30, stagger: 0.15, duration: 0.6, ease: 'back.out(3)' }, 0.15)
    .from(q('.how__line'), { scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'power3.inOut' }, 0.2)
})
</script>

<template>
  <section ref="root" class="how">
    <SectionHead :eyebrow="copy.eyebrow" :title="copy.title" center />
    <div class="how__wrap">
      <span class="how__line" aria-hidden="true"></span>
      <ol class="how__steps">
        <li v-for="(s, i) in copy.steps" :key="s.title" class="how__step">
          <span class="how__num" aria-hidden="true">{{ i + 1 }}</span>
          <i :class="s.icon" class="how__icon" aria-hidden="true"></i>
          <h3 class="how__title">{{ s.title }}</h3>
          <p class="how__text">{{ s.text }}</p>
        </li>
      </ol>
    </div>
    <div class="how__cta">
      <RouterLink to="/menu" class="btn btn--cta">{{ site.hero.ctaPrimary }}</RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.how {
  @include container;
  padding-block: $space-section;

  &__wrap {
    position: relative;
  }

  &__line {
    display: none;

    @include from('md') {
      display: block;
      position: absolute;
      top: 3rem;
      left: 16%;
      right: 16%;
      border-top: 3px dashed $lime-deep;
    }
  }

  &__steps {
    list-style: none;
    position: relative;
    @include flex-cards(220px, 1.25rem);
  }

  &__step {
    @include flex(column, center, flex-start, 0.4rem);
    text-align: center;
    padding: 0 1rem 1.5rem;
  }

  &__num {
    @include flex(row, center, center);
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: $lime;
    border: 3px solid $ink;
    box-shadow: 0 6px 0 $ink;
    font-family: $font-display;
    font-weight: 700;
    font-size: 3.4rem;
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  &__icon {
    font-size: 1.4rem;
    color: $coral-deep;
  }

  &__title {
    @include display($text-xl, 700);
  }

  &__text {
    color: $ink-soft;
    max-width: 28ch;
  }

  &__cta {
    @include flex(row, center, center);
    margin-top: 1rem;
  }
}
</style>
