<script setup lang="ts">
import CardRow from './CardRow.vue'
import ProductCardSkeleton from './ProductCardSkeleton.vue'
</script>

<template>
  <div class="ssk" aria-busy="true" aria-label="Cargando menú">
    <div class="ssk__chips">
      <span v-for="n in 6" :key="n" class="skeleton ssk__chip"></span>
    </div>
    <section v-for="s in 2" :key="s" class="ssk__section">
      <span class="skeleton ssk__title"></span>
      <CardRow>
        <ProductCardSkeleton v-for="n in 4" :key="n" />
      </CardRow>
    </section>
  </div>
</template>

<style scoped lang="scss">
.ssk {
  &__chips {
    @include flex(row, center, flex-start, 0.5rem);
    overflow: hidden;
    padding-block: 0.6rem;
  }

  &__chip {
    flex-shrink: 0;
    width: 7.5rem;
    height: 44px;
    border-radius: $radius-pill;
  }

  &__section {
    padding-top: 2rem;
  }

  &__title {
    display: block;
    width: 12rem;
    height: 2rem;
    margin-bottom: 1rem;
  }
}
</style>
