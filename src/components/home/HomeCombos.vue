<script setup lang="ts">
import { computed, ref } from 'vue'
import SectionHead from './SectionHead.vue'
import ProductCard from '@/components/menu/ProductCard.vue'
import ProductCardSkeleton from '@/components/menu/ProductCardSkeleton.vue'
import { gsap, useGsap } from '@/composables/useGsap'
import { useMenu } from '@/composables/useMenu'
import { site } from '@/config/site'
import { home } from '@/config/home'

const { products, loading } = useMenu()
const root = ref<HTMLElement | null>(null)
const copy = site.sections.combos
const combos = computed(() => products.value.filter((p) => p.badges.includes('combo')).slice(0, 8))

useGsap(
  root,
  ({ motion, desktop }) => {
    if (!motion) return
    const q = gsap.utils.selector(root.value)
    // El fondo tribal se desliza más lento que el contenido (solo desktop: en el celular temblaba).
    if (desktop) {
      gsap.fromTo(q('.combos__bg'), { yPercent: -12 }, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }
    gsap.from(q('.combos__rail > *'), {
      y: 32,
      autoAlpha: 0,
      stagger: 0.06,
      duration: 0.55,
      clearProps: 'transform',
      ease: 'power3.out',
      scrollTrigger: { trigger: q('.combos__rail')[0], start: 'top 85%', once: true },
    })
  },
  () => !loading.value,
)
</script>

<template>
  <section v-if="loading || combos.length" ref="root" class="combos">
    <div class="combos__bg" aria-hidden="true"></div>
    <div class="combos__inner">
      <SectionHead :eyebrow="copy.eyebrow" :title="copy.title" :lead="copy.lead" tone="dark" />
    </div>
    <div class="combos__rail">
      <template v-if="loading">
        <ProductCardSkeleton v-for="n in 4" :key="n" />
      </template>
      <template v-else>
        <ProductCard v-for="p in combos" :key="p.id" :product="p" />
        <RouterLink :to="{ path: '/menu', query: { c: 'combos-de-hamburguesa' } }" class="combos__all">
          <span class="combos__all-script">{{ home.combos.save }}</span>
          <span class="combos__all-label">{{ home.combos.cta }}</span>
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.combos {
  position: relative;
  overflow: clip;
  padding-block: $space-section;
  color: $surface;
  isolation: isolate;

  &__bg {
    position: absolute;
    inset: -15% 0;
    z-index: -1;
    background: url('/brand/tribal-coral.jpg') center / cover;

    // Capa coral: la trama se intuye y el texto blanco se lee.
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba($coral-deep, 0.88), rgba(#b72d2d, 0.92));
    }
  }

  &__inner {
    @include container;
  }

  :deep(.shead__lead) {
    color: rgba($surface, 0.9);
  }

  &__rail {
    @include flex(row, stretch, flex-start, 1rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 0.5rem 1.25rem 1.5rem;
    scroll-padding-inline: 1.25rem;
    scrollbar-width: none;
    overscroll-behavior-x: contain;
    color: $ink;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      padding-inline: max(2rem, calc((100vw - 1160px) / 2 + 2rem));
      scroll-padding-inline: max(2rem, calc((100vw - 1160px) / 2 + 2rem));
    }

    > * {
      flex: 0 0 min(68vw, 270px);
      scroll-snap-align: start;
      box-shadow: 0 20px 40px -20px rgba(#5a0f0f, 0.6);
    }
  }

  &__all {
    @include flex(column, flex-start, flex-end, 0.25rem);
    padding: 1.5rem;
    border-radius: $radius-lg;
    background: $ink;
    color: $surface;
    transition: transform 0.3s $ease;

    &:hover {
      transform: rotate(-2deg) scale(1.02);
    }

    i {
      @include flex(row, center, center);
      width: 52px;
      height: 52px;
      margin-top: 0.75rem;
      border-radius: 50%;
      background: $lime;
      color: $ink;
    }
  }

  &__all-script {
    @include script($display-md);
    color: $lime;
  }

  &__all-label {
    @include display($text-xl, 700);
  }
}
</style>
