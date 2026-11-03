<script setup lang="ts">
import { formatCents } from '@/utils/format'
import { admin } from '@/config/admin'
import type { OrderItem } from '@/types'

defineProps<{ items: OrderItem[]; prices?: boolean }>()
</script>

<template>
  <ul class="items">
    <li v-for="(item, i) in items" :key="i" class="items__row">
      <span class="items__qty">{{ item.qty }}×</span>
      <div class="items__body">
        <div class="items__name">
          <span>{{ item.name }}</span>
          <span v-if="prices" class="items__price">{{ formatCents(item.lineTotal) }}</span>
        </div>
        <p v-if="item.options.length" class="items__opts">
          <span v-for="opt in item.options" :key="opt.name">{{ opt.name }}: <b>{{ opt.choice }}</b></span>
        </p>
        <p v-if="item.note" class="items__note">
          <i class="fa-solid fa-pen" aria-hidden="true"></i>
          <span class="visually-hidden">{{ admin.orders.note }}:</span> {{ item.note }}
        </p>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.items {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.55rem);

  &__row {
    @include flex(row, flex-start, flex-start, 0.6rem);
  }

  &__qty {
    flex: none;
    min-width: 2.1rem;
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.05rem;
    color: $lime-deep;
    line-height: 1.4;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__name {
    @include flex(row, baseline, space-between, 0.5rem);
    font-weight: 700;
    line-height: 1.35;
  }

  &__price {
    font-weight: 600;
    color: $ink-soft;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  &__opts {
    @include flex(row, center, flex-start, 0.15rem 0.7rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.4;
  }

  // Las notas se leen sí o sí: fondo amarillo de post-it
  &__note {
    margin-top: 0.3rem;
    background: rgba($warning, 0.18);
    border-left: 3px solid $warning;
    padding: 0.3rem 0.6rem;
    border-radius: 0 6px 6px 0;
    font-size: $text-sm;
    font-weight: 600;
    line-height: 1.4;

    i {
      font-size: 0.75em;
      margin-right: 0.2rem;
    }
  }
}
</style>
