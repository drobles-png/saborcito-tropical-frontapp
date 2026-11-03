<script setup lang="ts">
withDefaults(
  defineProps<{ eyebrow?: string; title: string; lead?: string; tone?: 'light' | 'dark'; center?: boolean }>(),
  { tone: 'light' },
)
</script>

<template>
  <header class="shead" :class="[`shead--${tone}`, { 'shead--center': center }]" data-head>
    <p v-if="eyebrow" class="shead__eyebrow">{{ eyebrow }}</p>
    <h2 class="shead__title">{{ title }}</h2>
    <p v-if="lead" class="shead__lead">{{ lead }}</p>
    <slot />
  </header>
</template>

<style scoped lang="scss">
.shead {
  @include flex(column, flex-start, flex-start, 0.6rem);
  margin-bottom: 1.75rem;

  &--center {
    align-items: center;
    text-align: center;
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.5rem);

    &::before {
      content: '';
      width: 22px;
      height: 3px;
      border-radius: 2px;
      background: currentColor;
    }
  }

  &__title {
    @include display($display-md, 700);
    max-width: 18ch;
  }

  &__lead {
    color: $ink-soft;
    max-width: 48ch;
  }

  &--dark {
    color: $surface;

    .shead__eyebrow {
      color: $lime;
    }

    .shead__lead {
      color: rgba($surface, 0.75);
    }
  }
}
</style>
