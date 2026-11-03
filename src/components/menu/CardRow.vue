<template>
  <div class="cards"><slot /></div>
</template>

<style scoped lang="scss">
// 2 columnas en móvil, 3 en tablet, 4 en desktop. Flex con base fija (no flex-grow)
// para que la última tarjeta suelta no se estire a todo el ancho.
.cards {
  @include flex(row, stretch, flex-start, 0.75rem);
  flex-wrap: wrap;

  @include from('md') {
    gap: 1rem;
  }

  > :deep(*) {
    flex: 0 1 calc(50% - 0.375rem);
    min-width: 0;

    @include from('md') {
      flex-basis: calc(33.333% - 0.667rem);
    }

    @include from('lg') {
      flex-basis: calc(25% - 0.75rem);
    }
  }
}
</style>
