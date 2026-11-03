<script setup lang="ts">
defineProps<{ title: string; icon: string }>()
</script>

<template>
  <fieldset class="block">
    <legend class="block__title">
      <span class="block__icon" aria-hidden="true"><i :class="icon"></i></span>
      {{ title }}
    </legend>
    <div class="block__body"><slot /></div>
  </fieldset>
</template>

<style scoped lang="scss">
.block {
  @include card;
  padding: 1.1rem;

  &__title {
    float: left; // la legend entra al flujo de la tarjeta
    width: 100%;
    @include flex(row, center, flex-start, 0.6rem);
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 600;
    margin-bottom: 0.9rem;
  }

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: $radius-sm;
    background: $lime-soft;
    color: $lime-deep;
    @include flex(row, center, center);
    font-size: 0.95rem;
  }

  &__body {
    clear: both;
    @include flex(column, stretch, flex-start, 0.85rem);

    :deep(.pair) {
      @include flex-cards(200px, 0.85rem);
    }
  }
}
</style>
