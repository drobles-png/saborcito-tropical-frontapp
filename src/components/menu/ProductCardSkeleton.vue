<template>
  <div class="sk" aria-hidden="true">
    <div class="sk__well skeleton"></div>
    <div class="sk__body">
      <span class="skeleton sk__line sk__line--title"></span>
      <span class="skeleton sk__line"></span>
      <span class="skeleton sk__line sk__line--short"></span>
      <div class="sk__foot">
        <span class="skeleton sk__price"></span>
        <span class="skeleton sk__btn"></span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Misma silueta que ProductCard: al llegar los datos nada salta.
.sk {
  @include flex(column, stretch, flex-start);
  background: $surface;
  border-radius: $radius-lg;
  border: 1px solid $line;
  overflow: hidden;

  &__well {
    aspect-ratio: 1;
    border-radius: 0;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.5rem);
    padding: 0.9rem 1rem 1rem;
  }

  &__line {
    height: 0.8rem;

    &--title {
      height: 1.2rem;
      width: 70%;
    }

    &--short {
      width: 45%;
    }
  }

  &__foot {
    @include flex(row, center, space-between);
    padding-top: 0.5rem;
  }

  &__price {
    width: 4.5rem;
    height: 1.8rem;
  }

  &__btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
}
</style>
