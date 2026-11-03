<script setup lang="ts">
// Tarjeta grande seleccionable (delivery/retiro, sucursal, método de pago). Va dentro de un role="radiogroup".
defineProps<{ selected: boolean; icon?: string; label: string; text?: string; meta?: string }>()
defineEmits<{ select: [] }>()
</script>

<template>
  <button
    type="button"
    role="radio"
    class="choice"
    :class="{ 'choice--on': selected }"
    :aria-checked="selected"
    @click="$emit('select')"
  >
    <span v-if="icon" class="choice__icon" aria-hidden="true"><i :class="icon"></i></span>
    <span class="choice__body">
      <span class="choice__label">{{ label }}</span>
      <span v-if="text" class="choice__text">{{ text }}</span>
      <span v-if="meta" class="choice__meta"><slot name="meta">{{ meta }}</slot></span>
    </span>
    <span class="choice__tick" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
  </button>
</template>

<style scoped lang="scss">
.choice {
  position: relative;
  @include flex(row, center, flex-start, 0.85rem);
  width: 100%;
  min-height: 72px;
  padding: 0.9rem 1rem;
  text-align: left;
  border: 2px solid $line;
  border-radius: $radius-md;
  background: $surface;
  -webkit-tap-highlight-color: transparent;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.16s $ease,
    box-shadow 0.2s ease;

  &:active {
    transform: scale(0.98);
  }

  @media (hover: hover) {
    &:hover {
      border-color: rgba($ink, 0.25);
    }
  }

  &--on,
  &--on:hover {
    border-color: $ink;
    background: $lime-soft;
    box-shadow: 0 4px 0 $ink;
  }

  &__icon {
    width: 46px;
    height: 46px;
    flex: 0 0 46px;
    border-radius: 14px;
    background: $sand;
    font-size: 1.25rem;
    color: $ink;
    @include flex(row, center, center);
    transition: background-color 0.2s ease;
  }

  &--on &__icon {
    background: $lime;
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.1rem);
    flex: 1;
    min-width: 0;
  }

  &__label {
    font-family: $font-display;
    font-weight: 600;
    font-size: 1.05rem;
    color: $ink;
    line-height: 1.2;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.35;
  }

  &__meta {
    font-size: $text-xs;
    font-weight: 700;
    color: $ink;
    margin-top: 0.15rem;
  }

  &__tick {
    width: 24px;
    height: 24px;
    flex: 0 0 24px;
    border-radius: 50%;
    border: 2px solid $line;
    font-size: 0.7rem;
    color: transparent;
    @include flex(row, center, center);
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &--on &__tick {
    background: $ink;
    border-color: $ink;
    color: $lime;
    transform: scale(1.1);
  }
}
</style>
