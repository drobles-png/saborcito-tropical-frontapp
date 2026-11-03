<script setup lang="ts">
import { ref } from 'vue'
import SectionHead from './SectionHead.vue'
import { gsap, useGsap } from '@/composables/useGsap'
import { useMenu } from '@/composables/useMenu'
import { imageUrl } from '@/utils/format'
import { site } from '@/config/site'
import { home } from '@/config/home'

const { categories, byCategory, loading } = useMenu()
const root = ref<HTMLElement | null>(null)
const rail = ref<HTMLElement | null>(null)
const tones = ['lime', 'ink', 'coral', 'purple', 'light']

const photo = (id: string) => byCategory(id)[0]?.image
function nudge(dir: number) {
  rail.value?.scrollBy({ left: dir * rail.value.clientWidth * 0.8, behavior: 'smooth' })
}

useGsap(
  root,
  ({ motion }) => {
    if (!motion) return
    // Entrada corta y sin giro: dentro de un carril horizontal, deslizar y rotar se leía raro.
    gsap.from(gsap.utils.toArray<HTMLElement>('.cats__card', root.value), {
      y: 24,
      autoAlpha: 0,
      stagger: 0.05,
      duration: 0.5,
      clearProps: 'transform',
      ease: 'power3.out',
      scrollTrigger: { trigger: rail.value, start: 'top 85%', once: true },
    })
  },
  () => !loading.value && categories.value.length > 0,
)
</script>

<template>
  <section ref="root" class="cats">
    <div class="cats__head">
      <SectionHead :eyebrow="site.sections.categories.eyebrow" :title="site.sections.categories.title" :lead="home.categories.lead" />
      <div class="cats__arrows">
        <button type="button" aria-label="Anteriores" @click="nudge(-1)"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button>
        <button type="button" aria-label="Siguientes" @click="nudge(1)"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
      </div>
    </div>

    <div ref="rail" class="cats__rail">
      <template v-if="loading">
        <div v-for="n in 5" :key="n" class="cats__card cats__card--sk skeleton" aria-hidden="true"></div>
      </template>
      <RouterLink
        v-for="(c, i) in categories"
        v-else
        :key="c.id"
        :to="{ path: '/menu', query: { c: c.slug } }"
        class="cats__card"
        :class="`cats__card--${tones[i % tones.length]}`"
      >
        <span class="cats__icon" aria-hidden="true"><i :class="c.icon"></i></span>
        <span class="cats__name">{{ c.name }}</span>
        <span v-if="c.tagline" class="cats__tagline">{{ c.tagline }}</span>
        <span class="cats__photo">
          <img v-if="photo(c.id)" :src="imageUrl(photo(c.id)!)" :alt="''" width="300" height="300" loading="lazy" />
        </span>
        <span class="cats__go" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cats {
  padding-block: $space-section calc($space-section * 0.6);

  &__head {
    @include container;
    @include flex(row, flex-end, space-between, 1rem);
  }

  &__arrows {
    display: none;
    margin-bottom: 1.75rem;

    @include from('lg') {
      @include flex(row, center, flex-end, 0.5rem);
    }

    button {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: 2px solid $ink;
      box-shadow: 0 3px 0 $ink;
      background: $surface;
      transition: transform 0.15s $ease;

      &:hover {
        background: $lime;
      }
      &:active {
        transform: translateY(2px);
      }
    }
  }

  &__rail {
    @include flex(row, stretch, flex-start, 0.9rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 1.25rem;
    padding: 0.5rem 1.25rem 1.5rem;
    scrollbar-width: none;
    overscroll-behavior-x: contain;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      scroll-padding-inline: max(2rem, calc((100vw - 1160px) / 2 + 2rem));
      padding-inline: max(2rem, calc((100vw - 1160px) / 2 + 2rem));
    }
  }

  &__card {
    position: relative;
    flex: 0 0 min(72vw, 260px);
    min-height: 330px;
    scroll-snap-align: start;
    border-radius: $radius-lg;
    padding: 1.25rem;
    @include flex(column, flex-start, flex-start, 0.35rem);
    overflow: hidden;
    transition: transform 0.35s $ease;
    @include focus-ring($coral-deep);

    @media (hover: hover) {
      &:hover {
        transform: translateY(-6px) rotate(-1.5deg);
      }
      &:hover .cats__photo {
        transform: rotate(0deg) scale(1.08);
      }
      &:hover .cats__go {
        transform: rotate(-45deg);
      }
    }

    &--sk {
      background: $sand;
    }

    &--lime {
      background: $lime;
      color: $ink;
    }
    &--ink {
      background: $ink;
      color: $surface;
    }
    &--coral {
      background: $coral-deep;
      color: $surface;
    }
    &--purple {
      background: $purple;
      color: $surface;
    }
    &--light {
      background: $lime-light;
      color: $ink;
    }
  }

  &__icon {
    @include flex(row, center, center);
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba($surface, 0.9);
    color: $ink;
    font-size: 1.1rem;
  }

  &__name {
    @include display($text-xl, 700);
    margin-top: 0.5rem;
  }

  &__tagline {
    font-size: $text-sm;
    line-height: 1.35;
    opacity: 0.85;
    max-width: 22ch;
  }

  &__photo {
    position: absolute;
    right: -18%;
    bottom: -14%;
    width: 78%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: $surface;
    overflow: hidden;
    transform: rotate(-8deg);
    transition: transform 0.5s $ease;
    box-shadow: 0 10px 30px -10px rgba($ink, 0.5);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__go {
    position: absolute;
    left: 1.25rem;
    bottom: 1.25rem;
    @include flex(row, center, center);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: $surface;
    color: $ink;
    transition: transform 0.3s $ease;
  }
}
</style>
