<script setup lang="ts">
import { computed, ref } from 'vue'
import PriceTag from '@/components/ui/PriceTag.vue'
import { gsap, useGsap } from '@/composables/useGsap'
import { useMenu } from '@/composables/useMenu'
import { useProductSheet } from '@/composables/useProductSheet'
import { imageUrl } from '@/utils/format'
import { site } from '@/config/site'
import { home } from '@/config/home'

const { products, loading } = useMenu()
const sheet = useProductSheet()
const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const copy = site.sections.collection
const items = computed(() => products.value.filter((p) => p.badges.includes('nuevo')))

useGsap(
  root,
  ({ motion, desktop }) => {
    if (!motion) return
    const q = gsap.utils.selector(root.value)
    gsap.from(q('.col__script'), {
      scale: 0.4,
      rotation: -12,
      autoAlpha: 0,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: { trigger: root.value, start: 'top 70%', once: true },
    })
    if (!desktop || !track.value) return

    // Desktop: la sección se queda pinneada y las burgers desfilan en horizontal.
    const distance = () => Math.max(0, track.value!.scrollWidth - window.innerWidth + 64)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: () => `+=${distance() + window.innerHeight * 0.4}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    })
    tl.to(track.value, { x: () => -distance(), ease: 'none' })
    q('.col__img').forEach((img) => {
      tl.fromTo(img, { rotation: -14, scale: 0.85 }, { rotation: 6, scale: 1, ease: 'none' }, 0)
    })
  },
  () => !loading.value && items.value.length > 0,
)
</script>

<template>
  <section v-if="loading || items.length" ref="root" class="col">
    <div class="col__inner">
      <header class="col__head">
        <h2 class="col__title">
          <span class="col__eyebrow">{{ copy.eyebrow }}</span>
          <span class="col__script">{{ copy.script }}</span>
        </h2>
        <p class="col__lead">{{ copy.lead }}</p>
        <span class="col__hint" aria-hidden="true">{{ home.collection.hint }} <i class="fa-solid fa-arrow-right"></i></span>
      </header>

      <div ref="track" class="col__track">
        <template v-if="loading">
          <div v-for="n in 3" :key="n" class="col__item col__item--sk skeleton" aria-hidden="true"></div>
        </template>
        <article v-for="(p, i) in items" v-else :key="p.id" class="col__item">
          <span class="col__num" aria-hidden="true">0{{ i + 1 }}</span>
          <img :src="imageUrl(p.image)" :alt="p.name" width="600" height="600" loading="lazy" class="col__img" />
          <h3 class="col__name">{{ p.name }}</h3>
          <p class="col__desc">{{ p.description }}</p>
          <div class="col__foot">
            <PriceTag :cents="p.price" size="lg" />
            <button type="button" class="btn btn--lime" @click="sheet.open(p)">{{ home.collection.cta }}</button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.col {
  background: $ink;
  color: $surface;
  overflow: clip;

  &__inner {
    padding-block: $space-section;

    @include from('lg') {
      min-height: 100vh;
      @include flex(column, stretch, center);
      padding-block: 3rem;
    }
  }

  &__head {
    @include container;
    @include flex(column, flex-start, flex-start, 0.25rem);
    margin-bottom: 1.5rem;
  }

  &__title {
    @include flex(column, flex-start, flex-start, 0);
  }

  &__eyebrow {
    @include display($display-md, 700);
    color: $surface;
  }

  &__script {
    @include script(clamp(4.5rem, 2rem + 12vw, 10rem));
    color: $lime;
    margin: -0.12em 0 0 0.4em; // roza "Nueva" sin taparla, como en el menú impreso
    transform: rotate(-5deg);
    transform-origin: left center;
  }

  &__lead {
    color: rgba($surface, 0.75);
    max-width: 40ch;
  }

  &__hint {
    margin-top: 0.5rem;
    font-size: $text-xs;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: $lime;

    @include from('lg') {
      display: none;
    }
  }

  // Móvil: carrusel nativo con snap. Desktop: pista que mueve GSAP.
  &__track {
    @include flex(row, stretch, flex-start, 1rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 1rem 1.25rem 0.5rem;
    scroll-padding-inline: 1.25rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('lg') {
      overflow: visible;
      width: max-content;
      padding-inline: max(2rem, calc((100vw - 1160px) / 2 + 2rem));
      gap: 2rem;
    }
  }

  &__item {
    position: relative;
    flex: 0 0 min(82vw, 340px);
    scroll-snap-align: start;
    @include flex(column, stretch, flex-start, 0.6rem);
    padding: 1.25rem;
    border-radius: $radius-lg;
    background: rgba($surface, 0.06);
    border: 1px solid rgba($surface, 0.1);

    @include from('lg') {
      flex-basis: 420px;
      padding: 1.75rem;
    }

    &--sk {
      min-height: 460px;
      background: rgba($surface, 0.08);
    }
  }

  &__num {
    position: absolute;
    top: 0.75rem;
    right: 1.25rem;
    font-family: $font-display;
    font-weight: 700;
    font-size: 3.5rem;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1.5px rgba($lime, 0.6);
  }

  &__img {
    width: 100%;
    aspect-ratio: 1;
    height: auto;
    object-fit: contain;
    border-radius: 50%;
    background: $surface;
    padding: 6%;
  }

  &__name {
    @include display($text-xl, 700);
    margin-top: 0.5rem;
  }

  &__desc {
    font-size: $text-sm;
    color: rgba($surface, 0.7);
  }

  &__foot {
    @include flex(row, center, space-between, 0.75rem);
    margin-top: auto;
    padding-top: 0.75rem;
    color: $lime;
  }
}
</style>
