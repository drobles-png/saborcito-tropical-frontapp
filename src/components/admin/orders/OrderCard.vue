<script setup lang="ts">
import { computed } from 'vue'
import OrderBadge from './OrderBadge.vue'
import OrderItems from './OrderItems.vue'
import OrderActions from './OrderActions.vue'
import { minutesSince, timeAgo, useNow } from '@/composables/admin/useTimeAgo'
import { formatCents } from '@/utils/format'
import { admin } from '@/config/admin'
import type { Order } from '@/types'

const props = defineProps<{ order: Order; fresh?: boolean }>()

const now = useNow()
const ago = computed(() => timeAgo(props.order.createdAt, now.value))
// Más de 20 min sin salir de cocina: se marca en coral
const late = computed(
  () => ['received', 'preparing'].includes(props.order.status) && minutesSince(props.order.createdAt, now.value) > 20,
)
const ful = computed(() => admin.fulfillment[props.order.fulfillment])
</script>

<template>
  <article class="ocard" :class="[`ocard--${order.status}`, { 'ocard--fresh': fresh }]">
    <header class="ocard__head">
      <RouterLink :to="{ name: 'AdminOrderDetail', params: { id: order.id } }" class="ocard__code">
        {{ order.code }}
      </RouterLink>
      <OrderBadge :status="order.status" />
    </header>

    <div class="ocard__meta">
      <span class="ocard__ago" :class="{ 'ocard__ago--late': late }">
        <i class="fa-regular fa-clock" aria-hidden="true"></i> {{ ago }}
      </span>
      <span class="ocard__ful">
        <i :class="ful.icon" aria-hidden="true"></i> {{ ful.label }}
      </span>
    </div>

    <p class="ocard__customer">
      <b>{{ order.customer.name }}</b>
      <a :href="`tel:${order.customer.phone}`">{{ order.customer.phone }}</a>
    </p>
    <p v-if="order.fulfillment === 'delivery'" class="ocard__where">
      <i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ order.address.street }}
    </p>
    <p v-else-if="order.branch" class="ocard__where">
      <i class="fa-solid fa-store" aria-hidden="true"></i> {{ order.branch }}
    </p>

    <OrderItems :items="order.items" class="ocard__items" />

    <p v-if="order.notes" class="ocard__notes">
      <i class="fa-solid fa-comment" aria-hidden="true"></i> {{ order.notes }}
    </p>

    <div class="ocard__pay">
      <span class="ocard__total">{{ formatCents(order.total) }}</span>
      <span class="ocard__method">{{ admin.payMethod[order.paymentMethod] }}</span>
      <span v-if="order.paymentMethod === 'cash' && order.cashChangeFor" class="ocard__method">
        · {{ admin.orders.cashChange }} {{ formatCents(order.cashChangeFor) }}
      </span>
      <OrderBadge :pay="order.paymentStatus" class="ocard__paybadge" />
    </div>

    <OrderActions :order="order" show-detail />
  </article>
</template>

<style scoped lang="scss">
.ocard {
  @include card;
  @include flex(column, stretch, flex-start, 0.65rem);
  padding: 1rem 1rem 1rem;
  border-top: 5px solid $line;
  box-shadow: $shadow-sm;
  transition:
    box-shadow 0.3s ease,
    border-color 0.3s ease;

  &--received {
    border-top-color: $coral;
  }
  &--preparing {
    border-top-color: $warning;
  }
  &--ready {
    border-top-color: $lime;
  }
  &--on_the_way {
    border-top-color: $info;
  }
  &--delivered {
    border-top-color: $success;
  }
  &--cancelled {
    opacity: 0.7;
  }

  // Recién llegado: halo lima que se apaga solo
  &--fresh {
    animation: fresh 2.4s ease-out 3;
  }

  &__head {
    @include flex(row, center, space-between, 0.5rem);
  }

  &__code {
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.6rem;
    letter-spacing: 0.01em;
    line-height: 1;
  }

  &__meta {
    @include flex(row, center, flex-start, 0.4rem 1rem);
    flex-wrap: wrap;
    font-size: $text-sm;
    color: $ink-soft;
    font-weight: 600;
  }

  &__ago--late {
    color: $coral-deep;
  }

  &__ful {
    background: $sand;
    border-radius: $radius-pill;
    padding: 0.1rem 0.6rem;
  }

  &__customer {
    @include flex(row, baseline, space-between, 0.5rem);
    flex-wrap: wrap;
    line-height: 1.3;

    a {
      font-size: $text-sm;
      color: $ink-soft;
      font-variant-numeric: tabular-nums;
    }
  }

  &__where {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.4;
    margin-top: -0.3rem;
  }

  &__items {
    border-top: 1px dashed $line;
    padding-top: 0.65rem;
  }

  &__notes {
    background: rgba($warning, 0.18);
    border-radius: 8px;
    padding: 0.45rem 0.7rem;
    font-size: $text-sm;
    font-weight: 600;
    line-height: 1.4;
  }

  &__pay {
    @include flex(row, center, flex-start, 0.3rem 0.5rem);
    flex-wrap: wrap;
    border-top: 1px dashed $line;
    padding-top: 0.65rem;
    margin-top: auto;
  }

  &__total {
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.35rem;
    font-variant-numeric: tabular-nums;
  }

  &__method {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__paybadge {
    margin-left: auto;
  }
}

@keyframes fresh {
  0% {
    box-shadow: 0 0 0 0 rgba($lime, 0.9);
  }
  100% {
    box-shadow: 0 0 0 14px rgba($lime, 0);
  }
}
</style>
