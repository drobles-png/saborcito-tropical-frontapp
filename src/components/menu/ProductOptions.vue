<script setup lang="ts">
import { formatCents } from '@/utils/format'
import { home } from '@/config/home'
import type { ProductOption } from '@/types'

defineProps<{
  options: ProductOption[]
  choices: Record<string, string>
  missing: string[]
  showErrors: boolean
}>()
const emit = defineEmits<{ toggle: [option: string, label: string, required: boolean] }>()
</script>

<template>
  <div class="opts">
    <fieldset
      v-for="opt in options"
      :key="opt.name"
      class="opts__group"
      :class="{ 'opts__group--error': showErrors && missing.includes(opt.name) }"
      :data-option="opt.name"
    >
      <legend class="opts__legend">
        {{ opt.name }}
        <span v-if="opt.required" class="opts__req">{{ home.product.required }}</span>
      </legend>
      <div class="opts__chips" role="radiogroup" :aria-label="opt.name">
        <button
          v-for="c in opt.choices"
          :key="c.label"
          type="button"
          role="radio"
          class="opts__chip"
          :class="{ 'opts__chip--on': choices[opt.name] === c.label }"
          :aria-checked="choices[opt.name] === c.label"
          @click="emit('toggle', opt.name, c.label, opt.required)"
        >
          <i class="fa-solid fa-check opts__tick" aria-hidden="true"></i>
          {{ c.label }}
          <small v-if="c.priceDelta" class="opts__delta">+{{ formatCents(c.priceDelta) }}</small>
        </button>
      </div>
      <Transition name="rise">
        <p v-if="showErrors && missing.includes(opt.name)" class="opts__error" role="alert">
          <i class="fa-solid fa-hand-point-up" aria-hidden="true"></i> {{ home.product.chooseFirst }}
        </p>
      </Transition>
    </fieldset>
  </div>
</template>

<style scoped lang="scss">
.opts {
  @include flex(column, stretch, flex-start, 1.2rem);

  &__group {
    border: 0;
    padding: 0.9rem;
    margin: 0 -0.9rem;
    border-radius: $radius-md;
    transition: background-color 0.3s ease;

    &--error {
      background: $coral-soft;
    }
  }

  &__legend {
    @include flex(row, center, flex-start, 0.5rem);
    font-family: $font-display;
    font-weight: 600;
    font-size: $text-base;
    margin-bottom: 0.6rem;
    float: left; // legend dentro de flex: así respeta el padding del fieldset
    width: 100%;
  }

  &__req {
    font-family: $font-principal;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    border-radius: $radius-pill;
    background: $ink;
    color: $surface;
  }

  &__chips {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    clear: both;
  }

  &__chip {
    @include flex(row, center, center, 0.4rem);
    min-height: 48px;
    padding: 0.55rem 1.1rem;
    border-radius: $radius-pill;
    border: 2px solid $line;
    background: $surface;
    font-family: $font-display;
    font-weight: 600;
    -webkit-tap-highlight-color: transparent;
    transition:
      transform 0.18s $ease,
      background-color 0.2s ease,
      border-color 0.2s ease;
    @include focus-ring($coral-deep);

    &:active {
      transform: scale(0.95);
    }

    &--on {
      background: $lime;
      border-color: $ink;
      box-shadow: 0 3px 0 $ink;
    }
  }

  &__tick {
    font-size: 0.75rem;
    width: 0;
    opacity: 0;
    transform: scale(0);
    transition:
      width 0.2s $ease,
      opacity 0.2s ease,
      transform 0.25s $ease;
  }

  &__chip--on &__tick {
    width: 0.8rem;
    opacity: 1;
    transform: scale(1);
  }

  &__delta {
    font-family: $font-principal;
    font-weight: 700;
    color: $ink-soft;
  }

  &__error {
    margin-top: 0.6rem;
    font-size: $text-sm;
    font-weight: 700;
    color: $coral-deep;
  }
}

@keyframes shake {
  20%,
  60% {
    transform: translateX(-6px);
  }
  40%,
  80% {
    transform: translateX(6px);
  }
}
</style>
