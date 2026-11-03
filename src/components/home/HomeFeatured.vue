<script setup lang="ts">
import { ref } from 'vue'
import SectionHead from './SectionHead.vue'
import CardRow from '@/components/menu/CardRow.vue'
import ProductCard from '@/components/menu/ProductCard.vue'
import ProductCardSkeleton from '@/components/menu/ProductCardSkeleton.vue'
import { revealBatch, useGsap } from '@/composables/useGsap'
import { useMenu } from '@/composables/useMenu'
import { site } from '@/config/site'
import { home } from '@/config/home'

const { featured, loading, error, reload } = useMenu()
const root = ref<HTMLElement | null>(null)
const copy = site.sections.featured

useGsap(
  root,
  ({ motion }) => motion && revealBatch('.feat .card', 0.09),
  () => !loading.value && featured.value.length > 0,
)
</script>

<template>
  <section ref="root" class="feat">
    <SectionHead :eyebrow="copy.eyebrow" :title="copy.title" :lead="copy.lead" />

    <div v-if="error" class="feat__error">
      <p>{{ home.states.error }}</p>
      <button type="button" class="btn btn--dark" @click="reload">{{ home.states.retry }}</button>
    </div>

    <CardRow v-else>
      <template v-if="loading">
        <ProductCardSkeleton v-for="n in 8" :key="n" />
      </template>
      <ProductCard v-for="p in featured.slice(0, 8)" v-else :key="p.id" :product="p" />
    </CardRow>

    <div class="feat__more">
      <RouterLink to="/menu" class="btn btn--dark">
        {{ copy.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.feat {
  @include container;
  padding-block: calc($space-section * 0.5) $space-section;

  &__error {
    @include flex(column, center, center, 0.75rem);
    padding: 2.5rem 1rem;
    border-radius: $radius-lg;
    background: $sand;
    text-align: center;
    font-weight: 600;
  }

  &__more {
    @include flex(row, center, center);
    margin-top: 2rem;
  }
}
</style>
