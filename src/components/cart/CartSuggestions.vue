<script setup lang="ts">
import { computed } from 'vue'
import PriceTag from '@/components/ui/PriceTag.vue'
import { useMenu } from '@/composables/useMenu'
import { useQuickAdd } from '@/composables/useQuickAdd'
import { hasRequiredOptions } from '@/composables/useProductSheet'
import { useCartStore } from '@/stores/cart'
import { imageUrl } from '@/utils/format'
import type { Product } from '@/types'

// "¿Le sumas…?": los acompañantes baratos de siempre, solo los que aún no están en el pedido.
const SUGGESTED = ['porcion-de-papas', 'yogurt-mediano', 'papas-cheddar', 'combo-1']

const emit = defineEmits<{ pick: [needsSheet: boolean] }>()
const { products } = useMenu()
const cart = useCartStore()
const quickAdd = useQuickAdd()

const items = computed(() =>
  SUGGESTED.map((slug) => products.value.find((p) => p.slug === slug))
    .filter((p): p is Product => !!p && p.isAvailable && !cart.lines.some((l) => l.productId === p.id))
    .slice(0, 2),
)

function pick(p: Product) {
  // si hay que elegir sabor, el drawer se cierra para dejar ver el sheet
  emit('pick', hasRequiredOptions(p))
  quickAdd(p)
}
</script>

<template>
  <section v-if="items.length" class="sugg" aria-label="Sugerencias">
    <p class="sugg__title">¿Le sumas algo?</p>
    <ul class="sugg__list">
      <li v-for="p in items" :key="p.id">
        <button type="button" class="sugg__item" :aria-label="`Agregar ${p.name}`" @click="pick(p)">
          <img :src="imageUrl(p.image)" alt="" width="56" height="56" loading="lazy" />
          <span class="sugg__name">{{ p.name }}</span>
          <PriceTag :cents="p.price" size="sm" />
          <span class="sugg__plus" aria-hidden="true"><i class="fa-solid fa-plus"></i></span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.sugg {
  padding: 1rem 1.25rem 0.5rem;

  &__title {
    font-family: $font-display;
    font-weight: 600;
    font-size: $text-base;
    margin-bottom: 0.6rem;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__item {
    width: 100%;
    min-height: 64px;
    @include flex(row, center, flex-start, 0.75rem);
    padding: 0.4rem 0.5rem 0.4rem 0.4rem;
    border: 2px dashed $line;
    border-radius: $radius-md;
    text-align: left;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      transform 0.15s $ease;

    &:active {
      transform: scale(0.98);
    }

    @media (hover: hover) {
      &:hover {
        border-color: $lime;
        background: $lime-soft;
      }
    }

    img {
      width: 56px;
      height: 56px;
      border-radius: $radius-sm;
      background: $surface;
      object-fit: contain;
    }
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-weight: 700;
    font-size: $text-sm;
    line-height: 1.25;
  }

  &__plus {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: $coral-deep;
    color: $surface;
    @include flex(row, center, center);
    font-size: 0.85rem;
  }
}
</style>
