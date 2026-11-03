<script setup lang="ts">
import { ref } from 'vue'
import PriceTag from '@/components/ui/PriceTag.vue'
import { gsap, useGsap } from '@/composables/useGsap'
import { splashShape } from '@/utils/splash'
import { home } from '@/config/home'

defineProps<{ priceCents: number }>()

const root = ref<HTMLElement | null>(null)
const splash = splashShape(11, 112)

// depth: cuánto se mueve con el scroll y el puntero (más = más cerca de la cámara).
const satellites = [
  { src: '/cutouts/papas.webp', w: 725, h: 406, cls: 'papas', depth: 1.2 },
  { src: '/cutouts/yogurt.webp', w: 461, h: 584, cls: 'yogurt', depth: 0.8 },
  { src: '/cutouts/bacon.webp', w: 724, h: 621, cls: 'bacon', depth: 1.6 },
  { src: '/cutouts/salchipapa.webp', w: 900, h: 887, cls: 'salchi', depth: 1 },
  { src: '/cutouts/chicken-pop.webp', w: 900, h: 578, cls: 'chicken', depth: 1.4 },
]
const tiles = [3, 6, 9]

useGsap(root, ({ motion, hover }) => {
  if (!motion) return
  const q = gsap.utils.selector(root.value)

  // Entrada: el splash estalla, la burger cae con rebote y aplasta, los satélites saltan.
  gsap
    .timeline({ delay: 0.35 })
    .from(q('.art__splash'), { scale: 0, rotation: -90, duration: 0.9, ease: 'back.out(2)' })
    .from(q('.art__drop'), { scale: 0, transformOrigin: '50% 50%', stagger: 0.04, duration: 0.4, ease: 'back.out(3)' }, '-=0.5')
    .from(q('.art__burger img'), { yPercent: -160, rotation: -18, duration: 0.95, ease: 'bounce.out' }, 0.15)
    .to(q('.art__burger img'), { scaleY: 0.88, scaleX: 1.08, transformOrigin: '50% 100%', duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.62)
    .from(q('.art__sat'), { scale: 0, rotation: () => gsap.utils.random(-60, 60), stagger: 0.07, duration: 0.7, ease: 'back.out(2.2)' }, 0.75)
    .from(q('.art__sticker'), { scale: 0, rotation: -200, duration: 0.9, ease: 'back.out(1.6)' }, 1)
    .from(q('.art__tile'), { autoAlpha: 0, scale: 0.4, stagger: 0.1, duration: 0.6 }, 0.6)

  // Vida en reposo: flotan, la trama gira lento, la pegatina rueda.
  q('.art__float').forEach((el, i) => {
    gsap.to(el, { y: i % 2 ? 14 : -14, rotation: i % 2 ? 6 : -6, duration: 2.2 + i * 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  })
  gsap.to(q('.art__burger img'), { y: -10, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 })
  gsap.to(q('.art__tile'), { rotation: '+=360', duration: 48, ease: 'none', repeat: -1 })
  gsap.to(q('.art__ring'), { rotation: 360, duration: 14, ease: 'none', repeat: -1 })
  gsap.to(q('.art__splash'), { rotation: 8, scale: 1.04, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.4 })

  // Parallax por scroll: cada pieza se va a su ritmo al bajar.
  q('[data-depth]').forEach((el) => {
    const depth = Number(el.dataset.depth)
    gsap.to(el, {
      y: -140 * depth,
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top top+=10%', end: 'bottom top', scrub: true },
    })
  })

  // Parallax por puntero (solo mouse): xPercent/yPercent para no pisar la "y" del scroll.
  if (!hover) return
  const movers = q('[data-depth]').map((el) => ({
    depth: Number(el.dataset.depth),
    x: gsap.quickTo(el, 'xPercent', { duration: 0.8, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'yPercent', { duration: 0.8, ease: 'power3.out' }),
  }))
  const onMove = (e: PointerEvent) => {
    const nx = e.clientX / window.innerWidth - 0.5
    const ny = e.clientY / window.innerHeight - 0.5
    movers.forEach((m) => (m.x(nx * 10 * m.depth), m.y(ny * 10 * m.depth)))
  }
  window.addEventListener('pointermove', onMove)
  return () => window.removeEventListener('pointermove', onMove)
})
</script>

<template>
  <div ref="root" class="art" aria-hidden="true">
    <img
      v-for="(t, i) in tiles"
      :key="t"
      :src="`/brand/tile-${t}.webp`"
      alt=""
      class="art__tile"
      :class="`art__tile--${i}`"
      width="196"
      height="220"
    />

    <svg class="art__splash" viewBox="-160 -160 320 320" data-depth="0.4">
      <path :d="splash.d" />
      <circle v-for="(d, i) in splash.drops" :key="i" class="art__drop" :cx="d.cx" :cy="d.cy" :r="d.r" />
    </svg>

    <div v-for="s in satellites" :key="s.cls" class="art__sat" :class="`art__sat--${s.cls}`" :data-depth="s.depth">
      <img :src="s.src" alt="" :width="s.w" :height="s.h" class="art__float" />
    </div>

    <div class="art__burger" data-depth="0.6">
      <img src="/cutouts/burger.webp" alt="" width="536" height="442" fetchpriority="high" />
    </div>

    <div class="art__sticker" data-depth="1.1">
      <svg class="art__ring" viewBox="0 0 120 120">
        <defs><path id="ring" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
        <text>
          <textPath href="#ring">{{ home.hero.stickerTop }} • {{ home.hero.stickerBottom }} • {{ home.hero.stickerTop }} •</textPath>
        </text>
      </svg>
      <PriceTag :cents="priceCents" size="md" class="art__price" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.art {
  position: relative;
  width: 100%;
  max-width: 600px;
  aspect-ratio: 1 / 0.9;
  margin-inline: auto;

  > * {
    position: absolute;
  }

  &__tile {
    width: 16%;
    height: auto;
    opacity: 0.9;

    &--0 {
      left: 2%;
      top: 34%;
    }
    &--1 {
      right: 4%;
      top: -2%;
      width: 12%;
    }
    &--2 {
      right: 28%;
      bottom: -4%;
      width: 13%;
    }
  }

  &__splash {
    left: 8%;
    top: 4%;
    width: 84%;
    height: auto;
    overflow: visible;
    fill: $coral;
  }

  &__burger {
    left: 15%;
    top: 16%;
    width: 70%;
    z-index: 2;

    img {
      width: 100%;
      height: auto;
      filter: drop-shadow(0 24px 22px rgba($ink, 0.35));
    }
  }

  &__sat {
    z-index: 3;

    img {
      width: 100%;
      height: auto;
      filter: drop-shadow(0 14px 14px rgba($ink, 0.28));
    }

    &--papas {
      left: -2%;
      top: 2%;
      width: 28%;
      z-index: 1;
      transform: rotate(-18deg);
    }
    &--yogurt {
      right: 6%;
      top: 0;
      width: 19%;
      z-index: 1;
    }
    &--bacon {
      left: -4%;
      top: 44%;
      width: 22%;
    }
    &--salchi {
      left: 10%;
      bottom: -6%;
      width: 32%;
    }
    &--chicken {
      right: -3%;
      bottom: -2%;
      width: 36%;
    }
  }

  &__sticker {
    right: -1%;
    top: 30%;
    z-index: 4;
    width: clamp(92px, 24%, 140px);
    aspect-ratio: 1;
    border-radius: 50%;
    background: $ink;
    color: $lime;
    @include flex(row, center, center);
    box-shadow: 0 6px 0 rgba($ink, 0.25);
    transform: rotate(10deg);
  }

  &__ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;

    text {
      font-family: $font-display;
      font-weight: 700;
      font-size: 11.5px;
      letter-spacing: 1.6px;
      text-transform: uppercase;
      fill: $surface;
    }
  }

  &__price {
    font-size: clamp(1.4rem, 5vw, 2.1rem);
  }
}
</style>
