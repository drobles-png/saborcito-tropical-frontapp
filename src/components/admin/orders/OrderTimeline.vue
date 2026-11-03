<script setup lang="ts">
import { computed } from 'vue'
import { formatDate, formatTime } from '@/utils/format'
import { admin } from '@/config/admin'
import type { Order } from '@/types'

const props = defineProps<{ history: Order['statusHistory'] }>()
const steps = computed(() => [...props.history].reverse())
</script>

<template>
  <section class="timeline">
    <h2 class="timeline__h">{{ admin.detail.timeline }}</h2>
    <TransitionGroup tag="ol" name="rise" class="timeline__list">
      <li v-for="(h, i) in steps" :key="h.at + h.status" class="timeline__step" :class="{ 'timeline__step--now': i === 0 }">
        <b>{{ admin.status[h.status] }}</b>
        <span>{{ formatTime(h.at) }} · {{ formatDate(h.at) }}</span>
      </li>
    </TransitionGroup>
  </section>
</template>

<style scoped lang="scss">
.timeline {
  @include card;
  padding: 1.1rem;

  &__h {
    @include eyebrow;
    color: $ink-muted;
    margin-bottom: 0.7rem;
  }

  &__list {
    list-style: none;
  }

  &__step {
    position: relative;
    @include flex(column, flex-start, flex-start);
    padding: 0 0 0.9rem 1.5rem;
    line-height: 1.35;

    // Riel y punto de la línea de tiempo
    &::before {
      content: '';
      position: absolute;
      left: 0.3rem;
      top: 0.45rem;
      bottom: -0.45rem;
      width: 2px;
      background: $line;
    }

    &:last-child::before {
      display: none;
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0.3rem;
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background: $surface;
      border: 2px solid $gray;
    }

    span {
      font-size: $text-sm;
      color: $ink-muted;
    }

    &--now::after {
      background: $lime;
      border-color: $lime-deep;
      box-shadow: 0 0 0 4px rgba($lime, 0.25);
    }
  }
}
</style>
