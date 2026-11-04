<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetail from '@/components/menu/ProductDetail.vue'
import ProductCard from '@/components/menu/ProductCard.vue'
import ProductCardSkeleton from '@/components/menu/ProductCardSkeleton.vue'
import CardRow from '@/components/menu/CardRow.vue'
import { menuService } from '@/services/menu.service'
import { home } from '@/config/home'
import { site } from '@/config/site'
import type { ApiError, Product } from '@/types'

const route = useRoute()
const product = ref<Product | null>(null)
const related = ref<Product[]>([])
const loading = ref(true)
const error = ref<ApiError | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    const data = await menuService.getProduct(String(route.params.slug))
    product.value = data.product
    related.value = data.related
    document.title = `${data.product.name} · ${site.name}`
  } catch (e) {
    error.value = e as ApiError
    product.value = null
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, (slug) => slug && load(), { immediate: true })
</script>

<template>
  <div class="pv">
    <RouterLink to="/menu" class="pv__back">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ home.product.back }}
    </RouterLink>

    <div v-if="loading" class="pv__sk" aria-busy="true" aria-label="Cargando producto">
      <div class="skeleton pv__sk-img"></div>
      <div class="pv__sk-info">
        <span class="skeleton pv__sk-line pv__sk-line--title"></span>
        <span class="skeleton pv__sk-line pv__sk-line--price"></span>
        <span class="skeleton pv__sk-line"></span>
        <span class="skeleton pv__sk-line"></span>
        <span class="skeleton pv__sk-line pv__sk-line--btn"></span>
      </div>
    </div>

    <div v-else-if="error" class="pv__state">
      <img src="/cutouts/burger.webp" alt="" width="776" height="721" class="pv__state-img" />
      <h1 class="pv__state-title">{{ error.status === 404 ? home.product.notFound : home.states.error }}</h1>
      <div class="pv__state-actions">
        <button v-if="error.status !== 404" type="button" class="btn btn--dark" @click="load">
          {{ home.states.retry }}
        </button>
        <RouterLink to="/menu" class="btn btn--cta">{{ home.product.back }}</RouterLink>
      </div>
    </div>

    <ProductDetail v-else-if="product" :key="product.id" :product="product" mode="page" />

    <section v-if="loading || related.length" class="pv__related">
      <h2 class="pv__related-title">{{ home.product.related }}</h2>
      <CardRow>
        <template v-if="loading">
          <ProductCardSkeleton v-for="n in 4" :key="n" />
        </template>
        <ProductCard v-for="p in related" v-else :key="p.id" :product="p" />
      </CardRow>
    </section>
  </div>
</template>

<style scoped lang="scss">
.pv {
  @include container;
  padding-block: 1.25rem $space-section;

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    min-height: 44px;
    font-family: $font-display;
    font-weight: 600;
    color: $ink-soft;
    margin-bottom: 0.75rem;

    @media (hover: hover) {
      &:hover {
        color: $coral-deep;
      }
    }
  }

  &__sk {
    @include flex(column, stretch, flex-start, 1.2rem);

    @include from('md') {
      flex-direction: row;
      gap: 2.5rem;
    }
  }

  &__sk-img {
    aspect-ratio: 1;
    border-radius: $radius-lg;

    @include from('md') {
      flex: 1 1 46%;
    }
  }

  &__sk-info {
    @include flex(column, stretch, flex-start, 0.9rem);

    @include from('md') {
      flex: 1 1 54%;
    }
  }

  &__sk-line {
    height: 1rem;

    &--title {
      height: 2.4rem;
      width: 75%;
    }
    &--price {
      height: 3.6rem;
      width: 35%;
    }
    &--btn {
      height: 52px;
      border-radius: $radius-pill;
      margin-top: 1rem;
    }
  }

  &__state {
    @include flex(column, center, center, 1rem);
    text-align: center;
    padding-block: $space-xl;
  }

  &__state-img {
    width: min(220px, 60vw);
    height: auto;
    transform: rotate(-12deg);
  }

  &__state-title {
    @include display($display-sm);
    max-width: 22ch;
  }

  &__state-actions {
    @include flex(row, center, center, 0.6rem);
    flex-wrap: wrap;
  }

  &__related {
    margin-top: $space-xl;
  }

  &__related-title {
    @include display($display-sm);
    margin-bottom: 1.25rem;
  }
}
</style>
