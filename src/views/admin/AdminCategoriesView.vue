<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import CategoryForm from '@/components/admin/categories/CategoryForm.vue'
import { useCategories } from '@/composables/admin/useCategories'
import { admin } from '@/config/admin'
import type { Category } from '@/types'

const t = admin.categories
const { list, loading, editing, draft, saving, edit, touchSlug, save, move, remove } = useCategories()
const toDelete = ref<Category | null>(null)

function confirmDelete() {
  const c = toDelete.value
  toDelete.value = null
  if (c) remove(c)
}
</script>

<template>
  <section class="cats">
    <header class="cats__head">
      <h1 class="cats__title">{{ t.title }}</h1>
      <button class="btn btn--lime" :disabled="editing === 'new'" @click="edit(null)">
        <i class="fa-solid fa-plus" aria-hidden="true"></i> {{ t.new }}
      </button>
    </header>

    <div v-if="loading" class="cats__list">
      <div v-for="n in 6" :key="n" class="cats__row">
        <div class="skeleton cats__ghost-icon"></div>
        <div class="skeleton cats__ghost-line"></div>
      </div>
    </div>

    <div v-else class="cats__list">
      <CategoryForm
        v-if="editing === 'new'"
        v-model="draft"
        :saving="saving"
        @save="save"
        @cancel="editing = null"
        @slug-edit="touchSlug"
      />
      <TransitionGroup tag="ul" name="cat" class="cats__ul">
        <li v-for="(c, i) in list" :key="c.id" class="cats__item">
          <CategoryForm
            v-if="editing === c.id"
            v-model="draft"
            :saving="saving"
            @save="save"
            @cancel="editing = null"
            @slug-edit="touchSlug"
          />
          <div v-else class="cats__row" :class="{ 'cats__row--off': !c.isActive }">
            <span class="cats__icon" aria-hidden="true"><i :class="c.icon"></i></span>
            <div class="cats__body">
              <b>{{ c.name }}</b>
              <span>{{ c.tagline || c.slug }}</span>
            </div>
            <span v-if="!c.isActive" class="cats__off">{{ t.inactive }}</span>
            <div class="cats__btns">
              <button class="cats__btn" :aria-label="`${t.up}: ${c.name}`" :disabled="i === 0" @click="move(i, -1)">
                <i class="fa-solid fa-chevron-up"></i>
              </button>
              <button
                class="cats__btn"
                :aria-label="`${t.down}: ${c.name}`"
                :disabled="i === list.length - 1"
                @click="move(i, 1)"
              >
                <i class="fa-solid fa-chevron-down"></i>
              </button>
              <button class="cats__btn" :aria-label="`${t.edit}: ${c.name}`" @click="edit(c)">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="cats__btn cats__btn--danger" :aria-label="`${t.delete}: ${c.name}`" @click="toDelete = c">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </li>
      </TransitionGroup>
    </div>

    <BaseModal
      :open="!!toDelete"
      :title="t.deleteTitle"
      :message="`${toDelete?.name ?? ''}. ${t.deleteText}`"
      :confirm-label="t.delete"
      danger
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </section>
</template>

<style scoped lang="scss">
.cats {
  @include flex(column, stretch, flex-start, 1rem);
  max-width: 820px;

  &__head {
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
  }

  &__title {
    @include display($display-sm, 700);
  }

  &__list {
    @include card;
    overflow: hidden;
  }

  &__ul {
    list-style: none;
    position: relative;
  }

  &__item + &__item,
  &__list > form + &__ul > &__item:first-child {
    border-top: 1px solid $line;
  }

  &__row {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    padding: 0.65rem 0.75rem;
    background: $surface;

    &--off {
      background: $paper;
    }
  }

  &__icon {
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: $radius-sm;
    background: $lime-soft;
    color: $ink;
    @include flex(row, center, center);
    font-size: 1.1rem;
  }

  &__row--off &__icon {
    background: $sand;
    color: $ink-muted;
  }

  &__body {
    flex: 1;
    min-width: 0;
    @include flex(column, flex-start, center);
    line-height: 1.3;

    span {
      font-size: $text-sm;
      color: $ink-muted;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }
  }

  &__off {
    font-size: $text-xs;
    font-weight: 700;
    color: $ink-muted;
    background: $sand;
    padding: 0.15rem 0.6rem;
    border-radius: $radius-pill;
  }

  &__btns {
    @include flex(row, center, flex-end);
  }

  &__btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: $ink-soft;

    &:hover {
      background: $sand;
    }

    &:disabled {
      opacity: 0.25;
    }

    &--danger:hover {
      background: $danger-bg;
      color: $danger;
    }
  }

  &__ghost-icon {
    width: 44px;
    height: 44px;
  }

  &__ghost-line {
    height: 1.1rem;
    width: 40%;
  }
}

.cat-move {
  transition: transform 0.4s $ease;
}
.cat-enter-active,
.cat-leave-active {
  transition: opacity 0.3s ease;
}
.cat-enter-from,
.cat-leave-to {
  opacity: 0;
}
</style>
