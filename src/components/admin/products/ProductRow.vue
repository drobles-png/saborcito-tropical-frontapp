<script setup lang="ts">
import PriceTag from '@/components/ui/PriceTag.vue'
import AdminSwitch from '@/components/admin/ui/AdminSwitch.vue'
import { imageUrl } from '@/utils/format'
import { admin } from '@/config/admin'
import type { Product } from '@/types'

defineProps<{ product: Product }>()
const emit = defineEmits<{ toggle: [field: 'isAvailable' | 'isFeatured' | 'isPublished'] }>()
const t = admin.products
</script>

<template>
  <article class="prow" :class="{ 'prow--hidden': !product.isPublished, 'prow--out': !product.isAvailable }">
    <RouterLink :to="{ name: 'AdminProductEdit', params: { id: product.id } }" class="prow__img">
      <img :src="imageUrl(product.image)" :alt="product.name" width="64" height="64" loading="lazy" />
    </RouterLink>

    <div class="prow__body">
      <RouterLink :to="{ name: 'AdminProductEdit', params: { id: product.id } }" class="prow__name">
        {{ product.name }}
      </RouterLink>
      <PriceTag :cents="product.price" size="sm" />
    </div>

    <div class="prow__controls">
      <AdminSwitch
        :model-value="product.isAvailable"
        :label="t.available"
        class="prow__avail"
        @update:model-value="emit('toggle', 'isAvailable')"
      />
      <button
        class="prow__icon"
        :class="{ 'prow__icon--star': product.isFeatured }"
        :aria-label="t.featured"
        :aria-pressed="product.isFeatured"
        @click="emit('toggle', 'isFeatured')"
      >
        <i :class="product.isFeatured ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
      </button>
      <button
        class="prow__icon"
        :class="{ 'prow__icon--off': !product.isPublished }"
        :aria-label="t.published"
        :aria-pressed="product.isPublished"
        @click="emit('toggle', 'isPublished')"
      >
        <i :class="product.isPublished ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
      </button>
      <RouterLink :to="{ name: 'AdminProductEdit', params: { id: product.id } }" class="prow__icon" :aria-label="t.edit">
        <i class="fa-solid fa-pen"></i>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
.prow {
  @include flex(row, center, flex-start, 0.75rem);
  flex-wrap: wrap;
  padding: 0.6rem 0.75rem;
  background: $surface;
  transition: opacity 0.25s ease;

  & + & {
    border-top: 1px solid $line;
  }

  &--hidden &__img,
  &--hidden &__body {
    opacity: 0.5;
  }

  // Pozo blanco: las fotos del menú vienen con fondo blanco
  &__img {
    flex: none;
    width: 64px;
    height: 64px;
    border-radius: $radius-sm;
    background: #fff;
    border: 1px solid $line;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &--out &__img img {
    filter: grayscale(1);
  }

  &__body {
    flex: 1;
    min-width: 0;
    @include flex(column, flex-start, center, 0.2rem);
  }

  &__name {
    font-weight: 700;
    line-height: 1.3;
  }

  &__controls {
    @include flex(row, center, flex-end, 0.15rem);
    width: 100%;

    @include from('md') {
      width: auto;
    }
  }

  &__avail {
    margin-right: auto;

    @include from('md') {
      margin-right: 0.75rem;
    }
  }

  &__icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    @include flex(row, center, center);
    color: $ink-muted;
    transition:
      color 0.2s ease,
      transform 0.2s $ease;

    &:hover {
      background: $sand;
    }

    &:active {
      transform: scale(0.85);
    }

    &--star {
      color: $warning;
    }

    &--off {
      color: $coral-deep;
    }
  }
}
</style>
