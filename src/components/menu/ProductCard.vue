<script setup lang="ts">
import { computed, ref } from 'vue'
import PriceTag from '@/components/ui/PriceTag.vue'
import ProductBadges from './ProductBadges.vue'
import { useProductSheet } from '@/composables/useProductSheet'
import { useQuickAdd } from '@/composables/useQuickAdd'
import { imageUrl } from '@/utils/format'
import { site } from '@/config/site'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; eager?: boolean }>()

const sheet = useProductSheet()
const quickAdd = useQuickAdd()
const img = ref<HTMLImageElement | null>(null)
const loaded = ref(false)
const cart = useCartStore()
// cuántas unidades de este producto ya van en el pedido (todas sus variantes)
const inCart = computed(() => cart.lines.reduce((n, l) => (l.productId === props.product.id ? n + l.qty : n), 0))
const tilt = ref({ x: 0, y: 0 })

// Tilt solo con mouse: en táctil la tarjeta se queda quieta.
function onMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  tilt.value = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 }
}
</script>

<template>
  <article
    class="card"
    :class="{ 'card--out': !product.isAvailable }"
    :style="{ '--tx': tilt.x, '--ty': tilt.y }"
    @pointermove="onMove"
    @pointerleave="tilt = { x: 0, y: 0 }"
  >
    <button type="button" class="card__hit" :aria-label="`Ver ${product.name}`" @click="sheet.open(product)"></button>

    <div class="card__well" :class="{ skeleton: !loaded }">
      <img
        ref="img"
        class="card__img"
        :class="{ 'card__img--in': loaded }"
        :src="imageUrl(product.image, 'sm')"
        :alt="product.name"
        width="600"
        height="600"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
        @load="loaded = true"
        @error="loaded = true"
      />
      <ProductBadges class="card__badges" :badges="product.badges" />
      <span v-if="!product.isAvailable" class="card__out">{{ site.shop.soldOut }}</span>
    </div>

    <div class="card__body">
      <h3 class="card__name">{{ product.name }}</h3>
      <p v-if="product.description" class="card__desc">{{ product.description }}</p>
      <ul v-if="product.includes.length" class="card__includes">
        <li v-for="inc in product.includes.slice(0, 3)" :key="inc">{{ inc }}</li>
      </ul>
      <div class="card__foot">
        <PriceTag :cents="product.price" size="md" />
        <button
          type="button"
          class="card__add"
          :aria-label="`${site.shop.add} ${product.name}`"
          :disabled="!product.isAvailable"
          @click.stop="quickAdd(props.product, img)"
        >
          <i class="fa-solid fa-plus" aria-hidden="true"></i>
          <Transition name="count">
            <span v-if="inCart" :key="inCart" class="card__count">{{ inCart }}<span class="visually-hidden"> en tu pedido</span></span>
          </Transition>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.card {
  position: relative;
  @include flex(column, stretch, flex-start);
  background: $surface;
  border-radius: $radius-lg;
  border: 1px solid $line;
  overflow: hidden;
  transition:
    transform 0.35s $ease,
    box-shadow 0.35s $ease;

  @media (hover: hover) {
    &:hover {
      transform: perspective(900px) rotateX(calc(var(--ty) * -5deg)) rotateY(calc(var(--tx) * 6deg)) translateY(-4px);
      box-shadow: $shadow-md;
    }

    &:hover .card__img--in {
      transform: scale(1.07) translate(calc(var(--tx) * -8px), calc(var(--ty) * -8px));
    }
  }

  // Toda la tarjeta abre el sheet; el "+" queda por encima.
  &__hit {
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: inherit;
    @include focus-ring($coral-deep);
  }

  &__well {
    position: relative;
    aspect-ratio: 1;
    background: $surface;
    border-radius: 0;
    overflow: hidden;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    transform: scale(0.96);
    transition:
      opacity 0.5s ease,
      transform 0.6s $ease;

    &--in {
      opacity: 1;
      transform: none;
    }
  }

  &__badges {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
  }

  &__out {
    position: absolute;
    inset: auto 0.75rem 0.75rem;
    text-align: center;
    font-family: $font-display;
    font-weight: 600;
    font-size: $text-sm;
    padding: 0.45rem;
    border-radius: $radius-pill;
    background: rgba($ink, 0.82);
    color: $surface;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.4rem);
    flex: 1;
    padding: 0.9rem 1rem 1rem;
  }

  &__name {
    @include display($text-lg, 600);
    line-height: 1.1;
  }

  &__desc {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__includes {
    list-style: none;
    font-size: $text-xs;
    color: $ink-soft;
    line-height: 1.5;

    li::before {
      content: '+';
      font-family: $font-display;
      font-weight: 700;
      color: $lime-deep;
      margin-right: 0.35rem;
    }
  }

  &__foot {
    @include flex(row, center, space-between, 0.5rem);
    margin-top: auto;
    padding-top: 0.5rem;
  }

  &__count {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 22px;
    height: 22px;
    padding-inline: 5px;
    border-radius: $radius-pill;
    background: $lime;
    color: $ink;
    border: 2px solid $surface;
    font-family: $font-display;
    font-weight: 700;
    font-size: 0.78rem;
    line-height: 18px;
    text-align: center;
  }

  &__add {
    position: relative;
    z-index: 2;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 50%;
    background: $coral-deep;
    color: $surface;
    font-size: 1.1rem;
    @include flex(row, center, center);
    box-shadow: 0 8px 18px -8px rgba($coral-deep, 0.8);
    -webkit-tap-highlight-color: transparent;
    transition:
      transform 0.2s $ease,
      background-color 0.2s ease;
    @include focus-ring($coral-deep);

    @media (hover: hover) {
      &:hover {
        transform: rotate(90deg) scale(1.08);
      }
    }

    &:active {
      transform: scale(0.86);
    }

    &:disabled {
      background: $line;
      color: $ink-muted;
      box-shadow: none;
    }
  }

  &--out {
    .card__img--in {
      filter: grayscale(1);
      opacity: 0.55;
    }

    .card__name,
    .card__foot {
      color: $ink-muted;
    }
  }
}

.count-enter-active {
  transition: transform 0.3s $ease;
}
.count-enter-from {
  transform: scale(0.3);
}
</style>
