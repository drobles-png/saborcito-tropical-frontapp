<script setup lang="ts">
import { ref } from 'vue'
import { gsap, useGsap } from '@/composables/useGsap'
import { site } from '@/config/site'
import { home } from '@/config/home'

const root = ref<HTMLElement | null>(null)
const copy = site.sections.yogurt

useGsap(root, ({ motion }) => {
  if (!motion) return
  const q = gsap.utils.selector(root.value)
  // El vaso sube desde el fondo del círculo y queda ahí, derecho; los panes caen a su lado.
  const tl = gsap.timeline({ scrollTrigger: { trigger: q('.yog__stage')[0], start: 'top 80%', once: true } })
  tl.from(q('.yog__cup'), { yPercent: 70, duration: 0.9, ease: 'power3.out' })
    .from(q('.yog__pan'), { y: -40, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 0.35)
  gsap.to(q('.yog__cup'), { y: -8, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 })
  gsap.from(q('.yog__chip'), {
    scale: 0,
    autoAlpha: 0,
    stagger: 0.07,
    duration: 0.5,
    ease: 'back.out(2.5)',
    scrollTrigger: { trigger: q('.yog__chips')[0], start: 'top 88%', once: true },
  })
})
</script>

<template>
  <section ref="root" class="yog">
    <div class="yog__inner">
      <div class="yog__visual" aria-hidden="true">
        <div class="yog__stage">
          <img src="/cutouts/yogurt.webp" alt="" width="461" height="584" class="yog__cup" loading="lazy" />
        </div>
        <img src="/cutouts/pan.webp" alt="" width="520" height="306" class="yog__pan" loading="lazy" />
      </div>

      <div class="yog__copy">
        <h2 class="yog__title">{{ copy.title }}</h2>
        <p class="yog__script">{{ copy.script }}</p>
        <p class="yog__lead">{{ copy.lead }}</p>
        <ul class="yog__chips" aria-label="Sabores">
          <li v-for="f in copy.flavors" :key="f" class="yog__chip">
            <span class="yog__dot" :style="{ background: home.yogurt.flavorColors[f] }" aria-hidden="true"></span>
            {{ f }}
          </li>
        </ul>
        <div class="yog__bread">
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
          <p>
            <strong>{{ home.yogurt.breadTitle }}.</strong> {{ home.yogurt.breadText }}
          </p>
        </div>
        <RouterLink :to="{ path: '/menu', query: { c: 'yogurt' } }" class="btn btn--cta yog__cta">
          {{ copy.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.yog {
  background: $lime-soft;
  overflow: clip;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 1rem);
    padding-block: $space-section;

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
    }
  }

  &__visual {
    position: relative;
    width: min(100%, 440px);
    aspect-ratio: 1;
    margin-inline: auto;

    @include from('lg') {
      flex: 1 1 45%;
    }
  }

  // Escenario: el vaso vive dentro del círculo (overflow) en vez de flotar suelto sobre el fondo.
  &__stage {
    position: absolute;
    inset: 4%;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 38%, $lime-light, $lime 70%);
    box-shadow: inset 0 -18px 0 rgba($ink, 0.08);
    overflow: hidden;
    @include flex(row, flex-end, center);
  }

  &__cup {
    width: 50%;
    height: auto;
    margin-bottom: 9%;
    filter: drop-shadow(0 18px 16px rgba($ink, 0.28));
    will-change: transform;
  }

  &__pan {
    position: absolute;
    right: 2%;
    bottom: 6%;
    width: 42%;
    height: auto;
    filter: drop-shadow(0 12px 12px rgba($ink, 0.25));
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 0.75rem);

    @include from('lg') {
      flex: 1 1 55%;
    }
  }

  &__title {
    @include display($display-lg, 700);
  }

  &__script {
    @include script($display-md);
    color: $coral-deep;
    margin-top: -0.4em;
    transform: rotate(-3deg);
  }

  &__lead {
    color: $ink-soft;
    max-width: 44ch;
  }

  &__chips {
    list-style: none;
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__chip {
    @include flex(row, center, flex-start, 0.45rem);
    padding: 0.5rem 0.95rem;
    border-radius: $radius-pill;
    background: $surface;
    border: 2px solid $ink;
    font-family: $font-display;
    font-weight: 600;
  }

  &__dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1.5px rgba($ink, 0.25);
  }

  &__bread {
    @include flex(row, flex-start, flex-start, 0.6rem);
    max-width: 44ch;
    font-size: $text-sm;

    i {
      @include flex(row, center, center);
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: $lime;
      font-size: 0.8rem;
    }
  }

  &__cta {
    margin-top: 0.5rem;
  }
}
</style>
