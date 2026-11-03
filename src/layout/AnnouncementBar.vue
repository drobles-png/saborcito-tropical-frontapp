<script setup lang="ts">
import { computed } from 'vue'
import { home } from '@/config/home'
import type { PublicSettings } from '@/types'

const props = defineProps<{ settings: PublicSettings | null }>()

const status = computed(() => {
  const s = props.settings
  if (!s) return null
  return s.storeOpen
    ? { open: true, label: home.header.open, text: s.openingHours }
    : { open: false, label: home.header.closed, text: s.closedMessage || s.openingHours }
})
</script>

<template>
  <div v-if="status || settings?.announcement" class="abar">
    <span v-if="status" class="abar__status" :class="{ 'abar__status--open': status.open }">
      <span class="abar__dot" aria-hidden="true"></span>
      <strong>{{ status.label }}</strong>
      <span v-if="status.text" class="abar__text">· {{ status.text }}</span>
    </span>
    <span v-if="settings?.announcement" class="abar__announce">{{ settings.announcement }}</span>
  </div>
</template>

<style scoped lang="scss">
.abar {
  @include flex(row, center, center, 0.75rem);
  background: $ink;
  color: $surface;
  font-size: $text-xs;
  padding: 0.4rem 1rem;
  min-height: 32px;
  text-align: center;
  overflow: hidden;

  &__status {
    @include flex(row, center, center, 0.35rem);
    white-space: nowrap;
    min-width: 0;
  }

  &__text {
    overflow: hidden;
    text-overflow: ellipsis;

    @include until('sm') {
      display: none;
    }
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $gray;
    flex-shrink: 0;
  }

  &__status--open &__dot {
    background: $lime;
    box-shadow: 0 0 0 0 rgba($lime, 0.7);
    animation: pulse 1.8s ease-out infinite;
  }

  &__announce {
    font-weight: 700;
    color: $lime;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
}

@keyframes pulse {
  to {
    box-shadow: 0 0 0 8px rgba($lime, 0);
  }
}
</style>
