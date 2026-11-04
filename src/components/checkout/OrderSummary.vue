<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useCheckout } from '@/composables/useCheckout'
import PriceTag from '@/components/ui/PriceTag.vue'
import { formatCents, imageUrl } from '@/utils/format'
import { checkoutCopy } from '@/config/checkout'

const cart = useCartStore()
const { form, deliveryFee, total } = useCheckout()
const copy = checkoutCopy.checkout.summary
const open = ref(false) // solo cuenta en móvil: en desktop el resumen siempre está abierto

const opts = (o: Record<string, string>) => Object.values(o).filter(Boolean).join(' · ')
const fee = computed(() => (deliveryFee.value ? formatCents(deliveryFee.value) : checkoutCopy.checkout.fulfillment.free))
</script>

<template>
  <div class="sum">
    <button type="button" class="sum__toggle" :aria-expanded="open" aria-controls="sum-body" @click="open = !open">
      <span class="sum__title">
        <i class="fa-solid fa-receipt" aria-hidden="true"></i>
        {{ copy.toggle(cart.count) }}
        <i class="fa-solid fa-chevron-down sum__chev" :class="{ 'sum__chev--up': open }" aria-hidden="true"></i>
      </span>
      <PriceTag :cents="total" size="sm" />
    </button>
    <h2 class="sum__heading">{{ copy.title }}</h2>

    <div id="sum-body" class="sum__body" :class="{ 'sum__body--open': open }">
      <ul class="sum__lines">
        <li v-for="l in cart.lines" :key="l.key" class="sum__line">
          <span class="sum__img"><img :src="imageUrl(l.image, 'sm')" :alt="l.name" width="48" height="48" /></span>
          <span class="sum__qty">{{ l.qty }}×</span>
          <span class="sum__name">
            {{ l.name }}
            <small v-if="opts(l.options)">{{ opts(l.options) }}</small>
            <small v-if="l.note">{{ l.note }}</small>
          </span>
          <span class="sum__amount">{{ formatCents(l.unitPrice * l.qty) }}</span>
        </li>
      </ul>
      <button type="button" class="sum__edit" @click="cart.open = true">
        <i class="fa-solid fa-pen" aria-hidden="true"></i> {{ copy.edit }}
      </button>
    </div>

    <dl class="sum__totals">
      <div class="sum__row">
        <dt>{{ copy.subtotal }}</dt>
        <dd>{{ formatCents(cart.subtotal) }}</dd>
      </div>
      <div v-if="form.fulfillment === 'delivery'" class="sum__row">
        <dt>{{ copy.delivery }}</dt>
        <dd>{{ fee }}</dd>
      </div>
      <div class="sum__row sum__row--total">
        <dt>{{ copy.total }}</dt>
        <dd><PriceTag :cents="total" size="lg" /></dd>
      </div>
    </dl>
  </div>
</template>

<style scoped lang="scss">
.sum {
  background: $surface;
  border: 1px solid $line;
  border-radius: $radius-md;
  padding: 0.4rem 1rem 1rem;

  @include from('lg') {
    padding: 1.4rem 1.4rem 1.2rem;
  }

  &__toggle {
    width: 100%;
    min-height: 52px;
    @include flex(row, center, space-between, 0.5rem);
    font-weight: 700;

    @include from('lg') {
      display: none;
    }
  }

  &__title {
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__chev {
    font-size: 0.75rem;
    transition: transform 0.25s $ease;

    &--up {
      transform: rotate(180deg);
    }
  }

  &__heading {
    display: none;
    @include display($text-xl, 600);
    margin-bottom: 0.8rem;

    @include from('lg') {
      display: block;
    }
  }

  &__body {
    display: none;

    &--open {
      display: block;
      animation: sum-open 0.3s $ease;
    }

    @include from('lg') {
      display: block;
      max-height: 42vh;
      overflow-y: auto;
    }
  }

  &__lines {
    list-style: none;
    border-top: 1px dashed $line;
  }

  &__line {
    @include flex(row, center, flex-start, 0.6rem);
    padding: 0.6rem 0;
    border-bottom: 1px dashed $line;
    font-size: $text-sm;
  }

  &__img {
    flex: 0 0 44px;
    height: 44px;
    border-radius: 10px;
    border: 1px solid $line;
    background: #fff;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__qty {
    font-family: $font-display;
    font-weight: 700;
  }

  &__name {
    flex: 1;
    min-width: 0;
    line-height: 1.3;
    font-weight: 600;

    small {
      display: block;
      font-weight: 400;
      color: $ink-muted;
    }
  }

  &__amount {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__edit {
    min-height: 40px;
    margin-top: 0.3rem;
    font-size: $text-sm;
    font-weight: 700;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &__totals {
    margin-top: 0.6rem;
  }

  &__row {
    @include flex(row, baseline, space-between);
    padding: 0.2rem 0;
    color: $ink-soft;

    dd {
      font-weight: 700;
      color: $ink;
    }

    &--total {
      margin-top: 0.4rem;
      padding-top: 0.6rem;
      border-top: 2px solid $ink;
      color: $ink;
      font-family: $font-display;
      font-weight: 700;
      font-size: 1.15rem;
    }
  }
}

@keyframes sum-open {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}
</style>
