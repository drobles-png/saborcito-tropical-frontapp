<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CategoryBar from '@/components/menu/CategoryBar.vue'
import CardRow from '@/components/menu/CardRow.vue'
import ProductCard from '@/components/menu/ProductCard.vue'
import ShopSkeleton from '@/components/menu/ShopSkeleton.vue'
import { useMenu } from '@/composables/useMenu'
import { useScrollSpy } from '@/composables/useScrollSpy'
import { revealBatch, ScrollTrigger, useGsap } from '@/composables/useGsap'
import { normalize } from '@/utils/text'
import { site } from '@/config/site'
import { home } from '@/config/home'

const { categories, products, loading, error, reload } = useMenu()
const route = useRoute()
const query = ref('')
const root = ref<HTMLElement | null>(null)

// Búsqueda instantánea sin tildes sobre nombre, descripción e "incluye".
const sections = computed(() => {
  const q = normalize(query.value)
  return categories.value
    .map((category) => ({
      category,
      items: products.value.filter(
        (p) =>
          p.category === category.id &&
          (!q || normalize(`${p.name} ${p.description} ${p.includes.join(' ')}`).includes(q)),
      ),
    }))
    .filter((s) => s.items.length)
})

const ids = computed(() => sections.value.map((s) => `cat-${s.category.slug}`))
const spy = useScrollSpy(ids)
const active = computed(() => spy.value.replace(/^cat-/, ''))

function goTo(slug: string) {
  document.getElementById(`cat-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Al filtrar cambian las alturas: las entradas pendientes deben recalcular su posición.
watch(query, () => nextTick(() => ScrollTrigger.refresh()))

// ?c=slug salta a la categoría apenas está el menú pintado.
watch(
  () => [route.query.c, loading.value] as const,
  async ([c, isLoading]) => {
    if (!c || isLoading) return
    // La sección aparece tras la transición de página: esperarla unos frames.
    for (let i = 0; i < 60; i++) {
      const el = document.getElementById(`cat-${c}`)
      if (el) return el.scrollIntoView({ behavior: 'instant', block: 'start' })
      await new Promise(requestAnimationFrame)
    }
  },
  { immediate: true },
)

useGsap(
  root,
  ({ motion }) => {
    if (!motion) return
    revealBatch('.shop__section .card', 0.06)
  },
  () => !loading.value && products.value.length > 0,
)
</script>

<template>
  <div ref="root" class="shop">
    <header class="shop__head">
      <h1 class="shop__title">{{ site.shop.title }}</h1>
      <label class="shop__search">
        <span class="visually-hidden">Buscar en el menú</span>
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input v-model="query" type="search" :placeholder="site.shop.searchPlaceholder" enterkeyhint="search" />
        <button v-if="query" type="button" class="shop__clear" :aria-label="home.states.clear" @click="query = ''">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
      </label>
    </header>

    <ShopSkeleton v-if="loading" />

    <div v-else-if="error" class="shop__state">
      <img src="/cutouts/papas.webp" alt="" width="725" height="406" class="shop__state-img" />
      <p class="shop__state-title">{{ home.states.error }}</p>
      <button type="button" class="btn btn--cta" @click="reload">
        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ home.states.retry }}
      </button>
    </div>

    <template v-else>
      <CategoryBar :categories="sections.map((s) => s.category)" :active="active" @select="goTo" />

      <Transition name="fade" mode="out-in">
        <div v-if="!sections.length" key="empty" class="shop__state">
          <img src="/cutouts/salchipapa.webp" alt="" width="900" height="887" class="shop__state-img" />
          <p class="shop__state-title">{{ home.states.noResults }} “{{ query }}”</p>
          <p class="shop__state-text">{{ site.shop.empty }}</p>
          <button type="button" class="btn btn--dark" @click="query = ''">{{ home.states.clear }}</button>
        </div>

        <div v-else key="list">
          <section
            v-for="s in sections"
            :id="`cat-${s.category.slug}`"
            :key="s.category.id"
            class="shop__section"
            :aria-labelledby="`h-${s.category.slug}`"
          >
            <div class="shop__section-head">
              <span class="shop__icon" aria-hidden="true"><i :class="s.category.icon"></i></span>
              <div>
                <h2 :id="`h-${s.category.slug}`" class="shop__section-title">{{ s.category.name }}</h2>
                <p v-if="s.category.tagline" class="shop__tagline">{{ s.category.tagline }}</p>
              </div>
            </div>
            <CardRow>
              <ProductCard v-for="p in s.items" :key="p.id" :product="p" />
            </CardRow>
          </section>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style scoped lang="scss">
.shop {
  @include container;
  padding-bottom: $space-section;

  &__head {
    @include flex(column, stretch, flex-start, 1rem);
    padding-block: 1.75rem 1rem;

    @include from('md') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
      padding-block: 3rem 1.5rem;
    }
  }

  &__title {
    @include display($display-md, 700);
  }

  &__search {
    position: relative;
    margin: 0;
    @include flex(row, center, flex-start);

    @include from('md') {
      width: 380px;
    }

    > i {
      position: absolute;
      left: 1.1rem;
      color: $ink-muted;
      pointer-events: none;
    }

    input {
      min-height: 52px;
      padding-left: 2.9rem;
      padding-right: 3rem;
      border-radius: $radius-pill;
      border: 2px solid $line;
      font-size: 16px; // evita el zoom de iOS
      -webkit-appearance: none;
      appearance: none;

      &:focus {
        border-color: $ink;
        box-shadow: 0 3px 0 $ink;
      }

      &::-webkit-search-cancel-button {
        display: none;
      }
    }
  }

  &__clear {
    position: absolute;
    right: 0.3rem;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: $ink-soft;
  }

  &__section {
    padding-top: 2.25rem;
    // El salto por ancla deja ver el título bajo el header y la barra de categorías.
    scroll-margin-top: calc(var(--header-visible, var(--header-h)) + 64px);
  }

  &__section-head {
    @include flex(row, center, flex-start, 0.85rem);
    margin-bottom: 1.1rem;
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: $lime;
    color: $ink;
    font-size: 1.2rem;
    transform: rotate(-6deg);
  }

  &__section-title {
    @include display($display-sm, 700);
  }

  &__tagline {
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.3;
  }

  &__state {
    @include flex(column, center, center, 0.75rem);
    text-align: center;
    padding-block: $space-xl;
  }

  &__state-img {
    width: min(220px, 60vw);
    height: auto;
    transform: rotate(-8deg);
  }

  &__state-title {
    @include display($text-xl, 600);
    max-width: 26ch;
  }

  &__state-text {
    color: $ink-soft;
    max-width: 40ch;
  }
}
</style>
