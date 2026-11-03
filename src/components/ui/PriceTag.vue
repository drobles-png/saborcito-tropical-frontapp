<script setup lang="ts">
import { computed } from 'vue'
import { priceParts } from '@/utils/format'

// Precio con la firma del menú impreso: "$" chico, entero enorme y centavos en superíndice.
const props = withDefaults(defineProps<{ cents: number; size?: 'sm' | 'md' | 'lg' | 'xl' }>(), {
  size: 'md',
})
const parts = computed(() => priceParts(props.cents))
const label = computed(() => `$${parts.value.whole},${parts.value.decimals}`)
</script>

<template>
  <span class="price" :class="`price--${size}`" :aria-label="label">
    <span class="price__sign" aria-hidden="true">$</span>
    <span class="price__whole" aria-hidden="true">{{ parts.whole }}</span>
    <span class="price__dec" aria-hidden="true">,{{ parts.decimals }}</span>
  </span>
</template>

<style scoped lang="scss">
.price {
  display: inline-flex;
  align-items: flex-start;
  font-family: $font-display;
  font-weight: 700;
  line-height: 0.85;
  color: inherit;
  font-variant-numeric: tabular-nums;

  &__sign {
    font-size: 0.45em;
    margin-top: 0.12em;
    margin-right: 0.06em;
  }

  &__dec {
    font-size: 0.45em;
    margin-top: 0.06em;
  }

  &--sm {
    font-size: 1.25rem;
  }
  &--md {
    font-size: 1.75rem;
  }
  &--lg {
    font-size: 2.6rem;
  }
  &--xl {
    font-size: clamp(3rem, 2rem + 4vw, 5rem);
  }
}
</style>
