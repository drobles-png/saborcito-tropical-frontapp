<script setup lang="ts">
import { checkoutCopy } from '@/config/checkout'

defineProps<{ id: string; n: number; title: string; done?: boolean; optional?: boolean }>()
</script>

<template>
  <section :id="id" class="step" :class="{ 'step--done': done }">
    <header class="step__head">
      <span class="step__badge" aria-hidden="true">
        <Transition name="badge" mode="out-in">
          <i v-if="done" key="ok" class="fa-solid fa-check"></i>
          <span v-else key="n">{{ n }}</span>
        </Transition>
      </span>
      <h2 class="step__title">{{ title }}</h2>
      <span v-if="optional" class="step__optional">{{ checkoutCopy.checkout.optional }}</span>
      <span v-if="done" class="visually-hidden">(listo)</span>
    </header>
    <div class="step__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.step {
  background: $surface;
  border: 1px solid $line;
  border-radius: $radius-md;
  padding: 1.1rem 1rem 1.25rem;
  scroll-margin-top: calc(var(--header-h) + 1rem);
  transition: border-color 0.3s ease;

  @include from('md') {
    padding: 1.4rem 1.5rem 1.5rem;
  }

  &--done {
    border-color: rgba($lime-deep, 0.35);
  }

  &__head {
    @include flex(row, center, flex-start, 0.7rem);
    margin-bottom: 1rem;
  }

  &__badge {
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    border-radius: 50%;
    background: $ink;
    color: $surface;
    font-family: $font-display;
    font-weight: 700;
    @include flex(row, center, center);
    transition: background-color 0.3s ease;
  }

  &--done &__badge {
    background: $lime;
    color: $ink;
  }

  &__title {
    @include display($text-lg, 600);
  }

  &__optional {
    margin-left: auto;
    font-size: $text-xs;
    color: $ink-muted;
    font-weight: 600;
  }
}

.badge-enter-active {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.badge-leave-active {
  transition: transform 0.12s ease-in;
}
.badge-enter-from,
.badge-leave-to {
  transform: scale(0);
}
</style>
