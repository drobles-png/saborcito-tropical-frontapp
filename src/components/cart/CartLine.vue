<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore, type CartLine } from '@/stores/cart'
import PriceTag from '@/components/ui/PriceTag.vue'
import QtyStepper from '@/components/ui/QtyStepper.vue'
import { imageUrl } from '@/utils/format'
import { checkoutCopy } from '@/config/checkout'

const props = defineProps<{ line: CartLine }>()
const cart = useCartStore()
const copy = checkoutCopy.cart

const options = computed(() => Object.values(props.line.options).filter(Boolean).join(' · '))
const qty = computed({
  get: () => props.line.qty,
  set: (v: number) => cart.setQty(props.line.key, v),
})
</script>

<template>
  <li class="line">
    <div class="line__img">
      <img :src="imageUrl(line.image)" :alt="line.name" width="72" height="72" loading="lazy" />
    </div>
    <div class="line__body">
      <div class="line__top">
        <p class="line__name">{{ line.name }}</p>
        <PriceTag :cents="line.unitPrice * line.qty" size="sm" />
      </div>
      <p v-if="options" class="line__meta">{{ options }}</p>
      <p v-if="line.note" class="line__meta line__meta--note">
        <i class="fa-solid fa-pen" aria-hidden="true"></i> {{ line.note }}
      </p>
      <div class="line__actions">
        <QtyStepper v-model="qty" size="sm" />
        <button type="button" class="line__remove" :aria-label="`${copy.remove} ${line.name}`" @click="cart.remove(line.key)">
          <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </li>
</template>

<style scoped lang="scss">
.line {
  @include flex(row, flex-start, flex-start, 0.85rem);
  padding: 0.9rem 0;
  border-bottom: 1px dashed $line;
  list-style: none;
  background: $surface;

  &__img {
    flex: 0 0 72px;
    height: 72px;
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

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__top {
    @include flex(row, flex-start, space-between, 0.6rem);
  }

  &__name {
    font-family: $font-display;
    font-weight: 600;
    line-height: 1.2;
    color: $ink;
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-soft;
    line-height: 1.4;
    margin-top: 0.15rem;

    &--note {
      font-style: italic;
      color: $ink-muted;
    }
  }

  &__actions {
    @include flex(row, center, space-between);
    margin-top: 0.55rem;
  }

  &__remove {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: $ink-muted;
    transition:
      color 0.15s ease,
      background-color 0.15s ease,
      transform 0.15s $ease;
    -webkit-tap-highlight-color: transparent;

    &:active {
      transform: scale(0.9);
    }

    @media (hover: hover) {
      &:hover {
        color: $danger;
        background: $danger-bg;
      }
    }
  }
}
</style>
