<script setup lang="ts">
import { ref } from 'vue'
import { gsap, ScrollTrigger, useGsap } from '@/composables/useGsap'
import { site } from '@/config/site'

const root = ref<HTMLElement | null>(null)
const words = site.marquee
const tileFor = (i: number) => `/brand/tile-${(i % 10) + 1}.webp`

useGsap(root, ({ motion }) => {
  if (!motion) return
  const q = gsap.utils.selector(root.value)
  // Cada pista está duplicada: mover -50% y repetir = cinta infinita sin costura.
  const front = gsap.to(q('.mq__band--front .mq__track'), { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
  const back = gsap.fromTo(q('.mq__band--back .mq__track'), { xPercent: -50 }, { xPercent: 0, duration: 34, ease: 'none', repeat: -1 })

  // Con timeScale negativo un repeat:-1 se frena en 0: arrancar lejos del inicio.
  front.totalTime(front.duration() * 500)
  back.totalTime(back.duration() * 500)

  // La velocidad del scroll acelera la cinta y el sentido del scroll la invierte.
  let dir = 1
  ScrollTrigger.create({
    trigger: root.value,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      dir = self.direction
      const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(self.getVelocity()) / 400)
      gsap.to([front, back], { timeScale: boost * dir, duration: 0.2, overwrite: true })
      gsap.to([front, back], { timeScale: dir, duration: 1.2, delay: 0.25, ease: 'power2.out' })
    },
  })
})
</script>

<template>
  <section ref="root" class="mq" aria-label="Lo que se te antoja">
    <div class="mq__band mq__band--back" aria-hidden="true">
      <div class="mq__track">
        <template v-for="copy in 2" :key="copy">
          <span v-for="w in words" :key="`${copy}${w}`" class="mq__item">{{ w }} <i class="fa-solid fa-star"></i></span>
        </template>
      </div>
    </div>
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

    &--back {
      position: absolute;
      inset: 50% 0 auto;
      background: $coral;
      transform: translateY(-50%) rotate(2.5deg) scale(1.08);
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

  &__band--back &__item {
    font-size: clamp(1rem, 0.8rem + 1vw, 1.4rem);
    color: $surface;
    gap: 1rem;

    i {
      font-size: 0.7em;
      color: $lime;
    }
  }
}
</style>
