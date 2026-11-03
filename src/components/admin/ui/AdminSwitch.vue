<script setup lang="ts">
defineProps<{ modelValue: boolean; label: string; hideLabel?: boolean; disabled?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <button
    type="button"
    class="switch"
    :class="{ 'switch--on': modelValue }"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="hideLabel ? label : undefined"
    :disabled="disabled"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span class="switch__track" aria-hidden="true"><span class="switch__thumb"></span></span>
    <span v-if="!hideLabel" class="switch__label">{{ label }}</span>
  </button>
</template>

<style scoped lang="scss">
.switch {
  @include flex(row, center, flex-start, 0.65rem);
  min-height: 44px;
  font-weight: 600;
  font-size: $text-sm;
  text-align: left;
  -webkit-tap-highlight-color: transparent;

  &__track {
    flex: none;
    width: 46px;
    height: 28px;
    border-radius: $radius-pill;
    background: $line;
    padding: 3px;
    transition: background-color 0.25s ease;
  }

  &__thumb {
    display: block;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: $surface;
    box-shadow: $shadow-sm;
    transition: transform 0.3s $ease;
  }

  &--on &__track {
    background: $lime;
  }

  &--on &__thumb {
    transform: translateX(18px);
  }

  &:disabled {
    opacity: 0.5;
  }
}
</style>
