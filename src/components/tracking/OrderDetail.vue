<script setup lang="ts">
import { computed } from 'vue'
import PriceTag from '@/components/ui/PriceTag.vue'
import { formatCents, imageUrl } from '@/utils/format'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/checkout'
import { useLastOrder } from '@/composables/useLastOrder'
import type { TrackedOrder } from '@/types'

const props = defineProps<{ order: TrackedOrder }>()
const copy = checkoutCopy.tracking
const sum = checkoutCopy.checkout.summary
const { reorder } = useLastOrder()

const payStatus = computed(
  () => ({ paid: copy.paid, pending: copy.unpaid, failed: copy.failed })[props.order.paymentStatus],
)
const place = computed(() =>
  props.order.fulfillment === 'delivery'
    ? { label: copy.deliverTo, value: [props.order.address.street, props.order.address.reference].filter(Boolean).join(' · ') }
    : { label: copy.pickupAt, value: props.order.branch },
)
</script>

<template>
  <section class="detail">
    <h2 class="detail__title">{{ copy.detail }}</h2>
    <ul class="detail__items">
      <li v-for="(item, i) in order.items" :key="i" class="detail__item">
        <span class="detail__img"><img :src="imageUrl(item.image)" :alt="item.name" width="52" height="52" loading="lazy" /></span>
        <span class="detail__name">
          <strong>{{ item.qty }}× {{ item.name }}</strong>
          <small v-if="item.options.length">{{ item.options.map((o) => o.choice).join(' · ') }}</small>
          <small v-if="item.note">{{ item.note }}</small>
        </span>
        <span class="detail__amount">{{ formatCents(item.lineTotal) }}</span>
      </li>
    </ul>

    <dl class="detail__rows">
      <div class="detail__row">
        <dt>{{ sum.subtotal }}</dt>
        <dd>{{ formatCents(order.subtotal) }}</dd>
      </div>
      <div v-if="order.fulfillment === 'delivery'" class="detail__row">
        <dt>{{ sum.delivery }}</dt>
        <dd>{{ order.deliveryFee ? formatCents(order.deliveryFee) : checkoutCopy.checkout.fulfillment.free }}</dd>
      </div>
      <div class="detail__row detail__row--total">
        <dt>{{ sum.total }}</dt>
        <dd><PriceTag :cents="order.total" size="md" /></dd>
      </div>
    </dl>

    <dl class="detail__facts">
      <div>
        <dt>{{ copy.payment }}</dt>
        <dd>
          <i :class="site.payment[order.paymentMethod].icon" aria-hidden="true"></i>
          {{ site.payment[order.paymentMethod].label }}
          <span class="detail__pill" :class="`detail__pill--${order.paymentStatus}`">{{ payStatus }}</span>
          <small v-if="order.paymentMethod === 'cash' && order.cashChangeFor">{{ copy.cashFor(formatCents(order.cashChangeFor)) }}</small>
        </dd>
      </div>
      <div v-if="place.value">
        <dt>{{ place.label }}</dt>
        <dd>{{ place.value }}</dd>
      </div>
      <div v-if="order.notes">
        <dt>{{ checkoutCopy.checkout.sections.notes }}</dt>
        <dd>{{ order.notes }}</dd>
      </div>
    </dl>

    <button type="button" class="btn btn--dark btn--block detail__again" @click="reorder(order)">
      <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Pedir esto otra vez
    </button>
  </section>
</template>

<style scoped lang="scss">
.detail {
  background: $surface;
  border: 1px solid $line;
  border-radius: $radius-md;
  padding: 1.2rem 1.1rem;

  &__title {
    @include display($text-lg, 600);
    margin-bottom: 0.6rem;
  }

  &__items {
    list-style: none;
  }

  &__item {
    @include flex(row, center, flex-start, 0.7rem);
    padding: 0.6rem 0;
    border-bottom: 1px dashed $line;
    font-size: $text-sm;
  }

  &__img {
    flex: 0 0 52px;
    height: 52px;
    border-radius: 12px;
    border: 1px solid $line;
    background: #fff;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__name {
    flex: 1;
    min-width: 0;
    line-height: 1.35;

    small {
      display: block;
      color: $ink-muted;
    }
  }

  &__amount {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__rows {
    margin-top: 0.7rem;
  }

  &__row {
    @include flex(row, baseline, space-between);
    padding: 0.15rem 0;
    color: $ink-soft;

    dd {
      color: $ink;
      font-weight: 700;
    }

    &--total {
      margin-top: 0.35rem;
      padding-top: 0.5rem;
      border-top: 2px solid $ink;
      font-family: $font-display;
      font-weight: 700;
      color: $ink;
    }
  }

  &__facts {
    @include flex(column, stretch, flex-start, 0.8rem);
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid $line;
    font-size: $text-sm;

    dt {
      @include eyebrow;
      color: $ink-muted;
    }

    dd small {
      display: block;
      color: $ink-muted;
    }
  }

  &__pill {
    margin-left: 0.35rem;
    padding: 0.1rem 0.55rem;
    border-radius: $radius-pill;
    font-size: $text-xs;
    font-weight: 700;
    background: $warning-bg;

    &--paid {
      background: $success-bg;
      color: $success;
    }

    &--failed {
      background: $danger-bg;
      color: $danger;
    }
  }
}

.detail__again {
  margin-top: 1.25rem;
}
</style>
