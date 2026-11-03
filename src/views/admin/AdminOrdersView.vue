<script setup lang="ts">
import OrderCard from '@/components/admin/orders/OrderCard.vue'
import { useOrdersBoard } from '@/composables/admin/useOrdersBoard'
import { admin } from '@/config/admin'

const t = admin.orders
const { tab, q, visible, loading, loadingMore, counts, freshIds, hasMore, load } = useOrdersBoard()
</script>

<template>
  <section class="orders">
    <header class="orders__head">
      <h1 class="orders__title">{{ t.title }}</h1>
      <label class="orders__search">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <span class="visually-hidden">{{ t.search }}</span>
        <input v-model="q" type="search" :placeholder="t.search" enterkeyhint="search" />
      </label>
    </header>

    <nav class="orders__tabs" aria-label="Estados">
      <button
        v-for="item in admin.tabs"
        :key="item.key"
        class="orders__tab"
        :class="{ 'orders__tab--on': tab === item.key }"
        :aria-pressed="tab === item.key"
        @click="tab = item.key"
      >
        {{ item.label }}
        <span v-if="counts[item.key] !== undefined" class="orders__count">{{ counts[item.key] }}</span>
      </button>
    </nav>

    <div v-if="loading" class="orders__grid" aria-busy="true">
      <div v-for="n in 6" :key="n" class="orders__ghost">
        <div class="skeleton orders__ghost-line orders__ghost-line--code"></div>
        <div class="skeleton orders__ghost-line"></div>
        <div class="skeleton orders__ghost-line orders__ghost-line--short"></div>
        <div class="skeleton orders__ghost-block"></div>
        <div class="skeleton orders__ghost-btn"></div>
      </div>
    </div>

    <p v-else-if="!visible.length" class="orders__empty">
      <i class="fa-solid fa-mug-hot" aria-hidden="true"></i>
      {{ t.empty }}
    </p>

    <TransitionGroup v-else tag="div" name="ocard" class="orders__grid">
      <OrderCard v-for="order in visible" :key="order.id" :order="order" :fresh="freshIds.has(order.id)" />
    </TransitionGroup>

    <button
      v-if="!loading && hasMore"
      class="btn btn--ghost orders__more"
      :class="{ 'orders__more--busy': loadingMore }"
      :disabled="loadingMore"
      @click="load(true)"
    >
      {{ t.loadMore }}
    </button>
  </section>
</template>

<style scoped lang="scss">
.orders {
  @include flex(column, stretch, flex-start, 1rem);

  &__head {
    @include flex(column, stretch, flex-start, 0.75rem);

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  &__title {
    @include display($display-sm, 700);
  }

  &__search {
    position: relative;
    margin: 0;

    @include from('md') {
      width: 340px;
    }

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

  // Pestañas deslizables en móvil
  &__tabs {
    @include flex(row, center, flex-start, 0.4rem);
    overflow-x: auto;
    scrollbar-width: none;
    margin-inline: -1rem;
    padding: 0.15rem 1rem 0.35rem;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('lg') {
      flex-wrap: wrap;
      margin-inline: 0;
      padding-inline: 0;
    }
  }

  &__tab {
    flex: none;
    @include flex(row, center, center, 0.45rem);
    min-height: 44px;
    padding: 0 1rem;
    border-radius: $radius-pill;
    background: $surface;
    border: 1px solid $line;
    font-weight: 700;
    font-size: $text-sm;
    transition:
      background-color 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;

    &--on {
      background: $ink;
      border-color: $ink;
      color: $surface;
    }
  }

  &__count {
    min-width: 1.5rem;
    padding: 0 0.4rem;
    border-radius: $radius-pill;
    background: $sand;
    color: $ink;
    font-size: 0.75rem;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  &__tab--on &__count {
    background: $lime;
  }

  &__grid {
    @include flex(column, stretch, flex-start, 1rem);
    position: relative;

    @include from('md') {
      @include flex-cards(320px, 1rem);
      align-items: flex-start;
    }

    @include from('xl') {
      > * {
        max-width: calc((100% - 2rem) / 3);
      }
    }
  }

  &__ghost {
    @include card;
    @include flex(column, stretch, flex-start, 0.7rem);
    padding: 1rem;
  }

  &__ghost-line {
    height: 1rem;

    &--code {
      height: 1.6rem;
      width: 45%;
    }

    &--short {
      width: 60%;
    }
  }

  &__ghost-block {
    height: 5.5rem;
  }

  &__ghost-btn {
    height: 56px;
    border-radius: $radius-md;
  }

  &__empty {
    @include flex(column, center, center, 0.6rem);
    padding: 4rem 1rem;
    color: $ink-muted;
    font-weight: 600;
    text-align: center;

    i {
      font-size: 2rem;
      color: $lime-deep;
    }
  }

  &__more {
    align-self: center;

    &--busy {
      animation: breathe 0.9s ease-in-out infinite alternate;
    }
  }
}

.ocard-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.45s $ease;
}
.ocard-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.ocard-enter-from {
  opacity: 0;
  transform: translateY(-14px) scale(0.97);
}
.ocard-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
.ocard-move {
  transition: transform 0.4s $ease;
}

@keyframes breathe {
  to {
    opacity: 0.5;
  }
}
</style>
