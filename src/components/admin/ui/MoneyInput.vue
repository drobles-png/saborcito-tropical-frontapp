<script setup lang="ts">
import { ref, watch } from 'vue'

// El API trabaja en centavos; la persona escribe dólares ("3,90" o "3.90").
const props = defineProps<{ modelValue: number; id?: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [cents: number] }>()

const toText = (cents: number) => (cents ? (cents / 100).toFixed(2) : '')
const text = ref(toText(props.modelValue))

watch(
  () => props.modelValue,
  (cents) => {
    if (toCents(text.value) !== cents) text.value = toText(cents)
  },
)

function toCents(value: string): number {
  const n = Number.parseFloat(value.replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0
}

function onInput(e: Event) {
  text.value = (e.target as HTMLInputElement).value
  emit('update:modelValue', toCents(text.value))
}
</script>

<template>
  <div class="money">
    <span class="money__sign" aria-hidden="true">$</span>
    <input
      :id="id"
      :value="text"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      :placeholder="placeholder ?? '0.00'"
      @input="onInput"
      @blur="text = toText(modelValue)"
    />
  </div>
</template>

<style scoped lang="scss">
.money {
  position: relative;

  &__sign {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    font-family: $font-display;
    font-weight: 600;
    color: $ink-muted;
    pointer-events: none;
  }

  input {
    padding-left: 1.8rem;
    font-variant-numeric: tabular-nums;
    font-size: 1rem;
    min-height: 44px;
  }
}
</style>
