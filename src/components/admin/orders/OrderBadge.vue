<script setup lang="ts">
import { computed } from 'vue'
import { admin } from '@/config/admin'
import type { OrderStatus, PaymentStatus } from '@/types'

const props = defineProps<{ status?: OrderStatus; pay?: PaymentStatus }>()

const label = computed(() => (props.status ? admin.status[props.status] : props.pay ? admin.payStatus[props.pay] : ''))
const tone = computed(() => `badge--${props.status || `pay-${props.pay}`}`)
</script>

<template>
  <span class="badge" :class="tone">{{ label }}</span>
</template>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.65rem;
  border-radius: $radius-pill;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.5;
  white-space: nowrap;
  transition:
    background-color 0.25s ease,
    color 0.25s ease;

  &::before {
    content: '';
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: currentColor;
  }

  &--received {
    background: $coral-soft;
    color: $coral-deep;
  }
  &--preparing {
    background: $warning-bg;
    color: darken($warning, 12%);
  }
  &--ready {
    background: $lime-soft;
    color: darken($lime-deep, 6%);
  }
  &--on_the_way {
    background: $info-bg;
    color: $info;
  }
  &--delivered,
  &--pay-paid {
    background: $success-bg;
    color: $success;
  }
  &--cancelled {
    background: $sand;
    color: $ink-muted;
  }
  &--pay-pending {
    background: $warning-bg;
    color: darken($warning, 12%);
  }
  &--pay-failed {
    background: $danger-bg;
    color: $danger;
  }
}
</style>
