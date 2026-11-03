<script setup lang="ts">
import type { ProductBadge } from '@/types'

defineProps<{ badges: ProductBadge[] }>()

const labels: Record<ProductBadge, string> = {
  nuevo: 'Nuevo',
  popular: 'Popular',
  combo: 'Combo',
  picante: 'Picante',
}
</script>

<template>
  <ul v-if="badges.length" class="badges">
    <li v-for="b in badges" :key="b" class="badges__item" :class="`badges__item--${b}`">
      <i v-if="b === 'picante'" class="fa-solid fa-pepper-hot" aria-hidden="true"></i>
      {{ labels[b] }}
    </li>
  </ul>
</template>

<style scoped lang="scss">
.badges {
  @include flex(row, center, flex-start, 0.35rem);
  flex-wrap: wrap;
  list-style: none;

  &__item {
    font-family: $font-display;
    font-weight: 600;
    font-size: 0.72rem;
    letter-spacing: 0.02em;
    line-height: 1;
    padding: 0.38rem 0.6rem;
    border-radius: $radius-pill;
    background: $ink;
    color: $surface;

    &--nuevo {
      background: $lime;
      color: $ink;
    }
    &--popular {
      background: $coral-deep;
    }
    &--combo {
      background: $purple;
    }
    &--picante {
      background: $pink;
    }
  }
}
</style>
