<script setup lang="ts">
import { computed } from 'vue'
import { formatTime } from '@/utils/format'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/checkout'
import type { OrderStatus, TrackedOrder } from '@/types'

const props = defineProps<{ order: TrackedOrder }>()

const flow = computed<Array<Exclude<OrderStatus, 'cancelled'>>>(() =>
  props.order.fulfillment === 'delivery'
    ? ['received', 'preparing', 'ready', 'on_the_way', 'delivered']
    : ['received', 'preparing', 'ready', 'delivered'],
)
const steps = computed(() => {
  const { status } = props.order
  // entregado = todos los pasos hechos, ninguno late
  const current = status === 'delivered' ? flow.value.length : flow.value.indexOf(status as Exclude<OrderStatus, 'cancelled'>)
  return flow.value.map((status, i) => {
    const at = [...props.order.statusHistory].reverse().find((h) => h.status === status)?.at
    const base = site.tracking.steps[status]
    const pickupReady = status === 'ready' && props.order.fulfillment === 'pickup'
    return {
      status,
      label: pickupReady ? checkoutCopy.tracking.pickupReady : base.label,
      text: base.text,
      at: at ? formatTime(at) : '',
      state: i < current ? 'done' : i === current ? 'now' : 'next',
    }
  })
})
</script>

<template>
  <ol class="tl">
    <li
      v-for="s in steps"
      :key="s.status"
      class="tl__step"
      :class="`tl__step--${s.state}`"
      :aria-current="s.state === 'now' ? 'step' : undefined"
    >
      <span class="tl__dot" aria-hidden="true">
        <i v-if="s.state === 'done'" class="fa-solid fa-check"></i>
      </span>
      <div class="tl__body">
        <p class="tl__label">
          {{ s.label }}
          <time v-if="s.at" class="tl__time">{{ s.at }}</time>
        </p>
        <Transition name="rise">
          <p v-if="s.state === 'now'" class="tl__text">{{ s.text }}</p>
        </Transition>
      </div>
    </li>
  </ol>
</template>

<style scoped lang="scss">
.tl {
  list-style: none;

  &__step {
    position: relative;
    @include flex(row, flex-start, flex-start, 0.9rem);
    padding-bottom: 1.2rem;

    // la línea que une los pasos se pinta lima hasta donde va el pedido
    &:not(:last-child)::before {
      content: '';
      position: absolute;
      left: 13px;
      top: 30px;
      bottom: 2px;
      width: 3px;
      border-radius: 3px;
      background: $line;
      transition: background-color 0.5s ease;
    }

    &--done:not(:last-child)::before {
      background: $lime;
    }
  }

  &__dot {
    position: relative;
    flex: 0 0 29px;
    height: 29px;
    border-radius: 50%;
    border: 3px solid $line;
    background: $surface;
    color: $ink;
    font-size: 0.75rem;
    @include flex(row, center, center);
    transition:
      background-color 0.4s ease,
      border-color 0.4s ease;
  }

  &__step--done &__dot {
    background: $lime;
    border-color: $lime;
  }

  &__step--now &__dot {
    border-color: $coral-deep;
    background: $coral-deep;
    color: $surface;

    &::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      border: 3px solid $coral;
      animation: tl-pulse 1.6s ease-out infinite;
    }
  }

  &__label {
    font-family: $font-display;
    font-weight: 600;
    font-size: 1.08rem;
    color: $ink-muted;
    line-height: 29px;
  }

  &__step--done &__label,
  &__step--now &__label {
    color: $ink;
  }

  &__step--now &__label {
    font-size: 1.25rem;
  }

  &__time {
    margin-left: 0.4rem;
    font-family: $font-principal;
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-muted;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }
}

@keyframes tl-pulse {
  from {
    transform: scale(1);
    opacity: 0.8;
  }
  to {
    transform: scale(1.9);
    opacity: 0;
  }
}
</style>
