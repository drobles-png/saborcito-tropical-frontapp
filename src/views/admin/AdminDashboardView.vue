<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import CountUp from '@/components/admin/dashboard/CountUp.vue'
import WeekChart from '@/components/admin/dashboard/WeekChart.vue'
import StoreSwitch from '@/components/admin/dashboard/StoreSwitch.vue'
import OrderBadge from '@/components/admin/orders/OrderBadge.vue'
import { useOrderAlerts } from '@/composables/admin/useOrderAlerts'
import { timeAgo, useNow } from '@/composables/admin/useTimeAgo'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { formatCents } from '@/utils/format'
import { admin } from '@/config/admin'
import type { AdminStats, ApiError, Order, OrderStatus } from '@/types'

const t = admin.dashboard
const stats = ref<AdminStats | null>(null)
const latest = ref<Order[] | null>(null)
const now = useNow()
const { arrivals } = useOrderAlerts()

async function load() {
  try {
    const [s, o] = await Promise.all([adminService.stats(), adminService.orders({ limit: 6 })])
    stats.value = s
    latest.value = o.items
  } catch (e) {
    useToastStore().error((e as ApiError).message || admin.genericError)
  }
}
onMounted(load)
watch(arrivals, load)

const kpis = computed(() => {
  const s = stats.value
  if (!s) return []
  return [
    { label: t.kpis.orders, value: s.today.orders, icon: 'fa-solid fa-receipt' },
    { label: t.kpis.sales, value: s.today.sales, money: true, icon: 'fa-solid fa-sack-dollar', hero: true },
    { label: t.kpis.avgTicket, value: s.today.avgTicket, money: true, icon: 'fa-solid fa-ticket' },
    { label: t.kpis.pending, value: s.pending, icon: 'fa-solid fa-fire-burner' },
  ]
})
const topMax = computed(() => Math.max(1, ...(stats.value?.topProducts.map((p) => p.qty) ?? [])))
const statusOrder: OrderStatus[] = ['received', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled']
</script>

<template>
  <section class="dash">
    <header class="dash__head">
      <h1 class="dash__title">{{ t.title }}</h1>
      <StoreSwitch />
    </header>

    <div class="dash__kpis">
      <template v-if="stats">
        <div v-for="k in kpis" :key="k.label" class="dash__kpi" :class="{ 'dash__kpi--hero': k.hero }">
          <span class="dash__kpi-label"><i :class="k.icon" aria-hidden="true"></i> {{ k.label }}</span>
          <CountUp :value="k.value" :money="k.money" class="dash__kpi-value" />
        </div>
      </template>
      <div v-for="n in 4" v-else :key="n" class="skeleton dash__kpi dash__kpi--ghost"></div>
    </div>

    <div class="dash__row">
      <div class="dash__card dash__card--wide">
        <h2 class="dash__h">{{ t.week }}</h2>
        <WeekChart v-if="stats" :days="stats.last7Days" />
        <div v-else class="skeleton dash__ghost-chart"></div>
      </div>
      <div class="dash__card">
        <h2 class="dash__h">{{ t.byStatus }}</h2>
        <ul v-if="stats" class="dash__list">
          <li v-for="s in statusOrder" :key="s" class="dash__status">
            <OrderBadge :status="s" />
            <b>{{ stats.byStatus[s] ?? 0 }}</b>
          </li>
        </ul>
        <div v-for="n in 5" v-else :key="n" class="skeleton dash__ghost-line"></div>
      </div>
    </div>

    <div class="dash__row">
      <div class="dash__card">
        <h2 class="dash__h">{{ t.top }}</h2>
        <ol v-if="stats?.topProducts.length" class="dash__list">
          <li v-for="p in stats.topProducts" :key="p.name" class="dash__top">
            <div class="dash__top-row">
              <span>{{ p.name }}</span>
              <b>{{ p.qty }}</b>
            </div>
            <span class="dash__top-bar" :style="{ width: `${(p.qty / topMax) * 100}%` }"></span>
          </li>
        </ol>
        <p v-else-if="stats" class="dash__empty">{{ t.empty }}</p>
        <div v-for="n in 5" v-else :key="n" class="skeleton dash__ghost-line"></div>
      </div>

      <div class="dash__card dash__card--wide">
        <div class="dash__h-row">
          <h2 class="dash__h">{{ t.latest }}</h2>
          <RouterLink :to="{ name: 'AdminOrders' }" class="dash__more">{{ t.seeAll }}</RouterLink>
        </div>
        <ul v-if="latest?.length" class="dash__list">
          <li v-for="o in latest" :key="o.id">
            <RouterLink :to="{ name: 'AdminOrderDetail', params: { id: o.id } }" class="dash__order">
              <span class="dash__order-code">{{ o.code }}</span>
              <span class="dash__order-who">{{ o.customer.name }} · {{ timeAgo(o.createdAt, now) }}</span>
              <OrderBadge :status="o.status" />
              <b class="dash__order-total">{{ formatCents(o.total) }}</b>
            </RouterLink>
          </li>
        </ul>
        <p v-else-if="latest" class="dash__empty">{{ t.empty }}</p>
        <div v-for="n in 5" v-else :key="n" class="skeleton dash__ghost-line"></div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.dash {
  @include flex(column, stretch, flex-start, 1.25rem);

  &__head {
    @include flex(column, stretch, flex-start, 0.9rem);

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__title {
    @include display($display-sm, 700);
  }

  &__kpis {
    @include flex-cards(150px, 0.75rem);
  }

  &__kpi {
    @include card;
    @include flex(column, flex-start, space-between, 0.5rem);
    min-height: 112px;
    padding: 1rem;

    &--hero {
      background: $lime;
      border-color: $lime;
    }

    &--ghost {
      border: none;
    }
  }

  &__kpi-label {
    font-size: $text-sm;
    font-weight: 700;
    color: $ink-soft;
  }

  &__kpi--hero &__kpi-label {
    color: $ink;
  }

  &__kpi-value {
    font-family: $font-display;
    font-weight: 700;
    font-size: clamp(1.7rem, 1.2rem + 2vw, 2.6rem);
    line-height: 1;
  }

  &__row {
    @include flex(column, stretch, flex-start, 1.25rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__card {
    @include card;
    flex: 1;
    min-width: 0;
    padding: 1.1rem;
    @include flex(column, stretch, flex-start, 0.9rem);

    &--wide {
      flex: 1.6;
    }
  }

  &__h {
    @include eyebrow;
    color: $ink-muted;
  }

  &__h-row {
    @include flex(row, center, space-between);
  }

  &__more {
    font-weight: 700;
    font-size: $text-sm;
    color: $lime-deep;
    min-height: 44px;
    @include flex(row, center, center);
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.55rem);
  }

  &__status {
    @include flex(row, center, space-between);
    font-family: $font-display;
    font-size: 1.1rem;
  }

  &__top {
    @include flex(column, stretch, flex-start, 0.25rem);
  }

  &__top-row {
    @include flex(row, baseline, space-between, 0.5rem);
    font-weight: 600;
    line-height: 1.3;

    b {
      font-family: $font-display;
    }
  }

  &__top-bar {
    height: 6px;
    border-radius: $radius-pill;
    background: $lime;
    animation: grow 0.8s $ease both;
    transform-origin: left;
  }

  &__order {
    @include flex(row, center, flex-start, 0.3rem 0.75rem);
    flex-wrap: wrap;
    min-height: 52px;
    padding: 0.45rem 0.6rem;
    border-radius: $radius-sm;
    transition: background-color 0.2s ease;

    &:hover {
      background: $sand;
    }
  }

  &__order-code {
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.1rem;
  }

  &__order-who {
    flex: 1;
    min-width: 8rem;
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__order-total {
    font-variant-numeric: tabular-nums;
  }

  &__empty {
    color: $ink-muted;
    font-size: $text-sm;
  }

  &__ghost-chart {
    height: 200px;
  }

  &__ghost-line {
    height: 1.6rem;
  }
}

@keyframes grow {
  from {
    transform: scaleX(0);
  }
}
</style>
