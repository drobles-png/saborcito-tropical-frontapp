<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { formatCents } from '@/utils/format'
import type { AdminStats } from '@/types'

const props = defineProps<{ days: AdminStats['last7Days'] }>()

const day = new Intl.DateTimeFormat('es-EC', { weekday: 'short' })
const grown = ref(false)
const active = ref<number | null>(null)

const max = computed(() => Math.max(1, ...props.days.map((d) => d.sales)))
const bars = computed(() =>
  props.days.map((d, i) => ({
    ...d,
    // mediodía local para que la zona horaria no corra el día
    label: day.format(new Date(`${d.date}T12:00:00`)).replace('.', ''),
    pct: Math.max(2, Math.round((d.sales / max.value) * 100)),
    today: i === props.days.length - 1,
  })),
)

onMounted(() => requestAnimationFrame(() => (grown.value = true)))
</script>

<template>
  <div class="chart" :class="{ 'chart--grown': grown }" role="list">
    <div
      v-for="(b, i) in bars"
      :key="b.date"
      class="chart__col"
      role="listitem"
      tabindex="0"
      :aria-label="`${b.label}: ${formatCents(b.sales)}, ${b.orders} pedidos`"
      @pointerenter="active = i"
      @pointerleave="active = null"
      @focus="active = i"
      @blur="active = null"
    >
      <div class="chart__track">
        <Transition name="tip">
          <div v-if="active === i" class="chart__tip" :style="{ bottom: `${b.pct}%` }">
            <b>{{ formatCents(b.sales) }}</b>
            <span>{{ b.orders }} ped.</span>
          </div>
        </Transition>
        <div
          class="chart__bar"
          :class="{ 'chart__bar--today': b.today }"
          :style="{ height: `${b.pct}%`, transitionDelay: `${i * 60}ms` }"
        ></div>
      </div>
      <span class="chart__day" :class="{ 'chart__day--today': b.today }">{{ b.label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart {
  @include flex(row, stretch, space-between, 0.5rem);
  height: 200px;

  &__col {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-end, 0.4rem);
    outline: none;
    cursor: default;
  }

  &__track {
    position: relative;
    flex: 1;
    @include flex(column, stretch, flex-end);
  }

  &__bar {
    border-radius: 8px 8px 3px 3px;
    background: $sand;
    transform: scaleY(0);
    transform-origin: bottom;
    transition:
      transform 0.7s $ease,
      background-color 0.2s ease;

    &--today {
      background: $lime;
    }
  }

  &--grown &__bar {
    transform: scaleY(1);
  }

  &__col:hover &__bar:not(&__bar--today),
  &__col:focus-visible &__bar:not(&__bar--today) {
    background: $lime-light;
  }

  &__tip {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -0.4rem);
    background: $ink;
    color: $surface;
    border-radius: 8px;
    padding: 0.3rem 0.55rem;
    font-size: 0.75rem;
    line-height: 1.25;
    white-space: nowrap;
    text-align: center;
    z-index: 2;
    @include flex(column, center, center);

    b {
      font-family: $font-display;
      font-size: 0.9rem;
    }
  }

  &__day {
    text-align: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: $ink-muted;
    text-transform: capitalize;

    &--today {
      color: $ink;
    }
  }
}

.tip-enter-active,
.tip-leave-active {
  transition: opacity 0.15s ease;
}
.tip-enter-from,
.tip-leave-to {
  opacity: 0;
}
</style>
