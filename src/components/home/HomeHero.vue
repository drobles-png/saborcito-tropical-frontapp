<script setup lang="ts">
import { computed, ref } from 'vue'
import HeroArt from './HeroArt.vue'
import { gsap, SplitText, useGsap } from '@/composables/useGsap'
import { useMenu } from '@/composables/useMenu'
import { site } from '@/config/site'
import { home } from '@/config/home'

const { products } = useMenu()
const root = ref<HTMLElement | null>(null)
const hero = site.hero

const stickerPrice = computed(
  () => products.value.find((p) => p.slug === home.hero.stickerSlug)?.price ?? home.hero.stickerFallbackCents,
)

useGsap(root, ({ motion }) => {
  if (!motion) return
  const q = gsap.utils.selector(root)

  // Titular letra a letra; autoSplit re-parte al cargar la fuente o cambiar el ancho.
  SplitText.create(q('.hero__line--split'), {
    type: 'chars',
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.chars, {
        yPercent: 110,
        rotation: () => gsap.utils.random(-25, 25),
        autoAlpha: 0,
        stagger: 0.035,
        duration: 0.8,
        ease: 'back.out(2)',
        delay: 0.1,
      }),
  })

  gsap
    .timeline({ delay: 0.45 })
    .from(q('.hero__script'), { scale: 0.3, rotation: -14, autoAlpha: 0, duration: 0.8, ease: 'elastic.out(1, 0.55)' })
    .from(q('.hero__eyebrow'), { y: -20, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }, 0)
    .from(q('.hero__lead'), { y: 24, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.35)
    .from(q('.hero__actions > *'), { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(1.8)' }, 0.5)
    .from(q('.hero__stat'), { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out' }, 0.7)

  // Al bajar, el texto se aleja un poco: profundidad sin marear.
  gsap.to(q('.hero__copy'), {
    yPercent: -12,
    autoAlpha: 0.4,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
  })
})
</script>

<template>
  <section ref="root" class="hero">
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow"><i class="fa-solid fa-fire-flame-curved" aria-hidden="true"></i> {{ hero.eyebrow }}</p>
        <h1 class="hero__title">
          <span class="hero__line hero__line--split">{{ hero.titleTop }}</span>
          <span class="hero__script">{{ hero.titleScript }}</span>
          <span class="hero__line hero__line--split">{{ hero.titleBottom }}</span>
        </h1>
        <p class="hero__lead">{{ hero.lead }}</p>
        <div class="hero__actions">
          <RouterLink to="/menu" class="btn btn--cta hero__cta">
            {{ hero.ctaPrimary }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
          <RouterLink to="/menu" class="btn btn--ghost">{{ hero.ctaSecondary }}</RouterLink>
        </div>
      </div>

      <HeroArt class="hero__art" :price-cents="stickerPrice" />

      <ul class="hero__stats">
        <li v-for="s in hero.stats" :key="s.label" class="hero__stat">
          <strong>{{ s.value }}</strong>
          <span>{{ s.label }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  background: $lime;
  overflow: clip;
  min-height: calc(100svh - var(--header-visible, var(--header-h)));
  @include flex(column, stretch, center);

  &__inner {
    @include container(1280px);
    @include flex(column, stretch, flex-start, 1.25rem);
    padding-block: 1.5rem 2.25rem;

    @include from('lg') {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      padding-block: 2rem 2.5rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1rem);

    @include from('lg') {
      flex: 1 1 46%;
    }
  }

  &__eyebrow {
    @include flex(row, center, flex-start, 0.45rem);
    font-family: $font-display;
    font-weight: 600;
    font-size: $text-sm;
    background: $ink;
    color: $lime;
    padding: 0.4rem 0.9rem;
    border-radius: $radius-pill;
  }

  &__title {
    @include flex(column, flex-start, flex-start);
    font-family: $font-display;
    font-weight: 700;
    font-size: clamp(3.2rem, 1rem + 11vw, 8.6rem);
    line-height: 0.86;
    letter-spacing: -0.03em;
    color: $ink;
  }

  &__line {
    display: block;
  }

  &__script {
    @include script(clamp(2.6rem, 1.2rem + 7vw, 6rem));
    color: $coral-deep;
    margin: 0.02em 0 0.02em 0.6em;
    transform: rotate(-6deg);
    display: inline-block;
  }

  &__lead {
    font-size: $text-lg;
    font-weight: 500;
    color: $ink;
    max-width: 34ch;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.25rem;
  }

  &__cta {
    font-size: 1.1rem;
    padding-inline: 1.8rem;
    min-height: 56px;
    box-shadow: 0 5px 0 $ink;

    i {
      transition: transform 0.25s $ease;
    }

    @media (hover: hover) {
      &:hover i {
        transform: translateX(4px);
      }
    }
  }

  &__art {
    @include from('lg') {
      flex: 1 1 50%;
    }
  }

  &__stats {
    list-style: none;
    @include flex(row, stretch, space-between, 0.5rem);
    border-top: 2px solid rgba($ink, 0.15);
    padding-top: 1rem;

    @include from('lg') {
      flex: 1 1 100%;
      justify-content: flex-start;
      gap: 3rem;
    }
  }

  &__stat {
    @include flex(column, flex-start, flex-start);
    line-height: 1.1;

    strong {
      font-family: $font-display;
      font-weight: 700;
      font-size: clamp(1.8rem, 1.2rem + 2.5vw, 2.8rem);
      color: $ink;
    }

    span {
      font-size: $text-xs;
      font-weight: 700;
      color: rgba($ink, 0.75);
    }
  }
}
</style>
