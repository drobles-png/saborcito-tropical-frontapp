<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue: number; min?: number; max?: number; size?: 'sm' | 'md' }>(), {
  min: 1,
  max: 50,
  size: 'md',
})
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

function step(delta: number) {
  const next = Math.min(props.max, Math.max(props.min, props.modelValue + delta))
  if (next !== props.modelValue) emit('update:modelValue', next)
}
</script>

<template>
  <div class="qty" :class="`qty--${size}`">
    <button
      type="button"
      class="qty__btn"
      :aria-label="modelValue <= min && min === 0 ? 'Quitar' : 'Restar uno'"
      :disabled="modelValue <= min"
      @click="step(-1)"
    >
      <i class="fa-solid fa-minus"></i>
    </button>
    <Transition name="qty-num" mode="out-in">
      <span :key="modelValue" class="qty__value" aria-live="polite">{{ modelValue }}</span>
    </Transition>
    <button type="button" class="qty__btn" aria-label="Sumar uno" :disabled="modelValue >= max" @click="step(1)">
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.qty {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: $sand;
  border-radius: $radius-pill;
  padding: 0.25rem;

  &__btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: $surface;
    color: $ink;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    box-shadow: $shadow-sm;
    transition: transform 0.15s $ease;

    &:active {
      transform: scale(0.88);
    }

    &:disabled {
      opacity: 0.35;
    }
  }

  &__value {
    min-width: 2ch;
    text-align: center;
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.1rem;
  }

  // 40px visibles + el padding del contenedor: objetivo táctil cómodo con el pulgar
  &--sm &__btn {
    width: 40px;
    height: 40px;
    font-size: 0.72rem;
  }

  &--sm &__value {
    font-size: 0.95rem;
  }
}

.qty-num-enter-active,
.qty-num-leave-active {
  transition:
    transform 0.16s $ease,
    opacity 0.16s ease;
}
.qty-num-enter-from {
  transform: translateY(-8px);
  opacity: 0;
}
.qty-num-leave-to {
  transform: translateY(8px);
  opacity: 0;
}
</style>
