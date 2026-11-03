<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ProductRow from '@/components/admin/products/ProductRow.vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { admin } from '@/config/admin'
import type { ApiError, Category, Product } from '@/types'

const t = admin.products
const toast = useToastStore()
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const q = ref('')
const filter = ref('all')

onMounted(async () => {
  try {
    ;[products.value, categories.value] = await Promise.all([adminService.products(), adminService.categories()])
  } catch (e) {
    toast.error((e as ApiError).message || admin.genericError)
  } finally {
    loading.value = false
  }
})

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const groups = computed(() => {
  const term = norm(q.value.trim())
  const list = products.value
    .filter((p) => !term || norm(p.name).includes(term))
    .filter((p) => (filter.value === 'soldout' ? !p.isAvailable : filter.value === 'hidden' ? !p.isPublished : true))
    .sort((a, b) => a.order - b.order)
  const known = new Set(categories.value.map((c) => c.id))
  const out = categories.value
    .map((c) => ({ id: c.id, name: c.name, items: list.filter((p) => p.category === c.id) }))
    .filter((g) => g.items.length)
  const orphans = list.filter((p) => !known.has(p.category))
  if (orphans.length) out.push({ id: 'none', name: t.noCategory, items: orphans })
  return out
})

// Interruptores inline: optimistas, con vuelta atrás si el API falla
async function toggle(p: Product, field: 'isAvailable' | 'isFeatured' | 'isPublished') {
  p[field] = !p[field]
  try {
    await adminService.updateProduct(p.id, { [field]: p[field] })
  } catch (e) {
    p[field] = !p[field]
    toast.error((e as ApiError).message || admin.genericError)
  }
}
</script>

<template>
  <section class="products">
    <header class="products__head">
      <h1 class="products__title">{{ t.title }}</h1>
      <RouterLink :to="{ name: 'AdminProductNew' }" class="btn btn--lime">
        <i class="fa-solid fa-plus" aria-hidden="true"></i> {{ t.new }}
      </RouterLink>
    </header>

    <div class="products__tools">
      <label class="products__search">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <span class="visually-hidden">{{ t.search }}</span>
        <input v-model="q" type="search" :placeholder="t.search" />
      </label>
      <div class="products__filters" role="group">
        <button
          v-for="f in t.filters"
          :key="f.key"
          class="products__filter"
          :class="{ 'products__filter--on': filter === f.key }"
          :aria-pressed="filter === f.key"
          @click="filter = f.key"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="products__group">
      <div v-for="n in 6" :key="n" class="products__ghost">
        <div class="skeleton products__ghost-img"></div>
        <div class="skeleton products__ghost-line"></div>
      </div>
    </div>

    <p v-else-if="!groups.length" class="products__empty">{{ t.empty }}</p>

    <TransitionGroup v-else tag="div" name="rise" class="products__list">
      <section v-for="g in groups" :key="g.id" class="products__group">
        <h2 class="products__cat">
          {{ g.name }} <span>{{ g.items.length }}</span>
        </h2>
        <ProductRow v-for="p in g.items" :key="p.id" :product="p" @toggle="(f) => toggle(p, f)" />
      </section>
    </TransitionGroup>
  </section>
</template>

<style scoped lang="scss">
.products {
  @include flex(column, stretch, flex-start, 1rem);

  &__head {
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
  }

  &__title {
    @include display($display-sm, 700);
  }

  &__tools {
    @include flex(column, stretch, flex-start, 0.6rem);

    @include from('md') {
      flex-direction: row;
      align-items: center;
    }
  }

  &__search {
    position: relative;
    margin: 0;
    flex: 1;

    i {
      position: absolute;
      left: 0.95rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
    }

    input {
      min-height: 48px;
      padding-left: 2.6rem;
      font-size: 1rem;
      border-radius: $radius-pill;
    }
  }

  &__filters {
    @include flex(row, center, flex-start, 0.35rem);
  }

  &__filter {
    min-height: 44px;
    padding: 0 1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-weight: 700;
    font-size: $text-sm;
    transition: background-color 0.2s ease;

    &--on {
      background: $ink;
      border-color: $ink;
      color: $surface;
    }
  }

  &__list {
    @include flex(column, stretch, flex-start, 1.25rem);
  }

  &__group {
    @include card;
    overflow: hidden;
  }

  &__cat {
    @include flex(row, center, space-between);
    padding: 0.7rem 0.9rem;
    background: $sand;
    font-size: 1.05rem;
    font-weight: 600;

    span {
      font-size: $text-sm;
      color: $ink-muted;
    }
  }

  &__ghost {
    @include flex(row, center, flex-start, 0.75rem);
    padding: 0.6rem 0.75rem;
  }

  &__ghost-img {
    width: 64px;
    height: 64px;
    flex: none;
  }

  &__ghost-line {
    height: 1.1rem;
    width: 50%;
  }

  &__empty {
    padding: 3rem 1rem;
    text-align: center;
    color: $ink-muted;
  }
}
</style>
