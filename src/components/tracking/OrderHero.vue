<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { useToastStore } from '@/stores/toast'
import { checkoutCopy } from '@/config/checkout'
import { site } from '@/config/site'

const props = defineProps<{ code: string; celebrate: boolean }>()
const copy = checkoutCopy.tracking
const root = ref<HTMLElement | null>(null)
const tiles = Array.from({ length: 14 }, (_, i) => `/brand/tile-${(i % 10) + 1}.webp`)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    useToastStore().success(copy.copied)
  } catch {
    // sin permiso de portapapeles: el código igual está a la vista
  }
}

// Estallido de azulejos de la trama desde el check: salen disparados, giran y se desvanecen.
onMounted(() => {
  const el = root.value
  if (!props.celebrate || !el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const imgs = el.querySelectorAll('.hero__burst img')
  imgs.forEach((img, i) => {
    const angle = (i / imgs.length) * Math.PI * 2 + Math.random() * 0.4
    const dist = 120 + Math.random() * 120
    gsap.fromTo(
      img,
      { x: 0, y: 0, scale: 0.2, rotate: 0, opacity: 1 },
      {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist * 0.75 + 80,
        scale: 0.6 + Math.random() * 0.5,
        rotate: (Math.random() - 0.5) * 540,
        opacity: 0,
        duration: 1.4 + Math.random() * 0.5,
        ease: 'power3.out',
        delay: 0.15,
      },
    )
  })
  gsap.from(el.querySelector('.hero__check'), { scale: 0, rotate: -30, duration: 0.7, ease: 'back.out(2.2)' })
  gsap.from(el.querySelectorAll('.hero__reveal'), {
    y: 16,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    delay: 0.25,
    ease: 'power3.out',
  })
})
</script>

<template>
  <header ref="root" class="hero">
    <div v-if="celebrate" class="hero__stage">
      <div class="hero__burst" aria-hidden="true">
        <img v-for="(src, i) in tiles" :key="i" :src="src" alt="" />
      </div>
      <span class="hero__check" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
    </div>
    <h1 class="hero__title hero__reveal">{{ celebrate ? copy.received : site.tracking.title }}</h1>
    <p v-if="celebrate" class="hero__lead hero__reveal">{{ copy.receivedText }}</p>
    <button type="button" class="hero__code hero__reveal" :aria-label="`${copy.copy} ${code}`" @click="copyCode">
      <span class="hero__code-label">{{ copy.code }}</span>
      <span class="hero__code-value">{{ code }}</span>
      <i class="fa-regular fa-copy" aria-hidden="true"></i>
    </button>
  </header>
</template>

<style scoped lang="scss">
.hero {
  @include flex(column, center, flex-start, 0.6rem);
  text-align: center;
  padding: 1.5rem 0 1rem;

  &__stage {
    position: relative;
    width: 120px;
    height: 120px;
    margin-bottom: 0.5rem;
  }

  &__burst {
    position: absolute;
    inset: 0;
    pointer-events: none;

    img {
      position: absolute;
      left: 30px;
      top: 30px;
      width: 60px;
      height: auto;
      opacity: 0;
    }
  }

  &__check {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: $lime;
    color: $ink;
    font-size: 3.6rem;
    box-shadow: 0 8px 0 $ink;
    @include flex(row, center, center);
  }

  &__title {
    @include display($display-md, 700);
  }

  &__lead {
    color: $ink-soft;
    max-width: 34ch;
  }

  &__code {
    @include flex(row, center, center, 0.7rem);
    margin-top: 0.4rem;
    min-height: 56px;
    padding: 0.5rem 1.2rem;
    border: 2px dashed $ink;
    border-radius: $radius-md;
    background: $surface;
    transition: transform 0.16s $ease;

    &:active {
      transform: scale(0.97);
    }
  }

  &__code-label {
    @include eyebrow;
  }

  &__code-value {
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.7rem;
    letter-spacing: 0.06em;
  }
}
</style>
