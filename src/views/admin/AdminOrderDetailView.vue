<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import OrderBadge from '@/components/admin/orders/OrderBadge.vue'
import OrderItems from '@/components/admin/orders/OrderItems.vue'
import OrderActions from '@/components/admin/orders/OrderActions.vue'
import OrderContact from '@/components/admin/orders/OrderContact.vue'
import OrderTimeline from '@/components/admin/orders/OrderTimeline.vue'
import OrderTicket from '@/components/admin/orders/OrderTicket.vue'
import { useOrderActions } from '@/composables/admin/useOrderActions'
import { adminService } from '@/services/admin.service'
import { formatCents, formatDate, formatTime } from '@/utils/format'
import { admin } from '@/config/admin'
import type { Order, OrderStatus } from '@/types'

const route = useRoute()
const t = admin.detail
const order = ref<Order | null>(null)
const loading = ref(true)
const { busy, setStatus } = useOrderActions()

onMounted(async () => {
  try {
    order.value = await adminService.order(String(route.params.id))
  } catch {
    order.value = null
  } finally {
    loading.value = false
  }
})

const statuses = computed<OrderStatus[]>(() =>
  order.value?.fulfillment === 'pickup'
    ? ['received', 'preparing', 'ready', 'delivered', 'cancelled']
    : ['received', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled'],
)

const print = () => window.print()
</script>

<template>
  <section class="detail">
    <RouterLink :to="{ name: 'AdminOrders' }" class="detail__back">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ t.back }}
    </RouterLink>

    <div v-if="loading" class="detail__cols" aria-busy="true">
      <div class="detail__main">
        <div class="skeleton detail__ghost detail__ghost--title"></div>
        <div class="skeleton detail__ghost"></div>
      </div>
      <div class="detail__side"><div class="skeleton detail__ghost"></div></div>
    </div>

    <p v-else-if="!order" class="detail__empty">{{ t.notFound }}</p>

    <template v-else>
      <header class="detail__head">
        <div>
          <h1 class="detail__code">{{ order.code }}</h1>
          <p class="detail__when">
            {{ formatDate(order.createdAt) }} · {{ formatTime(order.createdAt) }} ·
            <i :class="admin.fulfillment[order.fulfillment].icon" aria-hidden="true"></i>
            {{ admin.fulfillment[order.fulfillment].label }}
          </p>
        </div>
        <div class="detail__badges">
          <OrderBadge :status="order.status" />
          <OrderBadge :pay="order.paymentStatus" />
          <button class="btn btn--ghost btn--sm" @click="print">
            <i class="fa-solid fa-print" aria-hidden="true"></i> {{ t.print }}
          </button>
        </div>
      </header>

      <div class="detail__cols">
        <div class="detail__main">
          <div class="detail__card">
            <h2 class="detail__h">{{ t.items }}</h2>
            <OrderItems :items="order.items" prices />
            <p v-if="order.notes" class="detail__notes"><b>{{ t.notes }}:</b> {{ order.notes }}</p>
            <dl class="detail__sum">
              <div>
                <dt>{{ t.subtotal }}</dt>
                <dd>{{ formatCents(order.subtotal) }}</dd>
              </div>
              <div v-if="order.fulfillment === 'delivery'">
                <dt>{{ t.delivery }}</dt>
                <dd>{{ formatCents(order.deliveryFee) }}</dd>
              </div>
              <div class="detail__total">
                <dt>{{ t.total }}</dt>
                <dd>{{ formatCents(order.total) }}</dd>
              </div>
            </dl>
            <p class="detail__pay">
              {{ admin.payMethod[order.paymentMethod] }}
              <template v-if="order.cashChangeFor">
                · {{ admin.orders.cashChange }} {{ formatCents(order.cashChangeFor) }}
              </template>
            </p>
            <OrderActions :order="order" />
          </div>

          <div class="detail__card">
            <h2 class="detail__h">{{ t.setStatus }}</h2>
            <div class="detail__chips">
              <button
                v-for="s in statuses"
                :key="s"
                class="detail__chip"
                :class="{ 'detail__chip--on': order.status === s }"
                :disabled="busy === order.id || order.status === s"
                @click="setStatus(order, s)"
              >
                {{ admin.status[s] }}
              </button>
            </div>
          </div>
        </div>

        <aside class="detail__side">
          <OrderContact :order="order" />
          <OrderTimeline :history="order.statusHistory" />
        </aside>
      </div>

      <OrderTicket :order="order" />
    </template>
  </section>
</template>

<style scoped lang="scss">
.detail {
  @include flex(column, stretch, flex-start, 1rem);

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    min-height: 44px;
    align-self: flex-start;
    font-weight: 700;
    color: $ink-soft;
  }

  &__head {
    @include flex(row, flex-end, space-between, 0.75rem);
    flex-wrap: wrap;
  }

  &__code {
    @include display($display-sm, 700);
  }

  &__when {
    color: $ink-soft;
    font-size: $text-sm;
    margin-top: 0.3rem;
  }

  &__badges {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__cols {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__main {
    flex: 1.6;
    min-width: 0;
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__side {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__card {
    @include card;
    padding: 1.1rem;
    @include flex(column, stretch, flex-start, 0.85rem);
  }

  &__h {
    @include eyebrow;
    color: $ink-muted;
  }

  &__notes {
    background: rgba($warning, 0.18);
    border-radius: 8px;
    padding: 0.55rem 0.8rem;
    font-size: $text-sm;
  }

  &__sum {
    border-top: 1px dashed $line;
    padding-top: 0.7rem;

    div {
      @include flex(row, baseline, space-between);
      font-variant-numeric: tabular-nums;
    }
  }

  &__total {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 700;
  }

  &__pay {
    color: $ink-soft;
    font-size: $text-sm;
  }

  &__chips {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__chip {
    min-height: 44px;
    padding: 0 1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    font-weight: 700;
    font-size: $text-sm;
    transition: background-color 0.2s ease;

    &--on {
      background: $lime;
      border-color: $lime;
    }

    &:disabled:not(&--on) {
      opacity: 0.5;
    }
  }

  &__ghost {
    height: 260px;
    border-radius: 14px;

    &--title {
      height: 2.4rem;
      width: 40%;
    }
  }

  &__empty {
    padding: 4rem 1rem;
    text-align: center;
    color: $ink-muted;
  }
}

// Al imprimir solo sale la comanda (OrderTicket)
@media print {
  .detail > :not(:last-child),
  .detail__head,
  .detail__cols,
  :global(.admin__side),
  :global(.admin__top),
  :global(.admin__tabs),
  :global(.toasts) {
    display: none !important;
  }

  :global(.admin__main) {
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
