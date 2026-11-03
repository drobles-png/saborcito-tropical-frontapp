<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { admin } from '@/config/admin'

// Lista de textos editable ("Incluye"): Enter agrega una línea nueva.
const list = defineModel<string[]>({ required: true })
defineProps<{ placeholder?: string; addLabel: string }>()
const root = ref<HTMLElement>()

async function add() {
  list.value = [...list.value, '']
  await nextTick()
  root.value?.querySelectorAll('input')[list.value.length - 1]?.focus()
}

function update(i: number, value: string) {
  list.value = list.value.map((v, j) => (j === i ? value : v))
}
</script>

<template>
  <div ref="root" class="list">
    <TransitionGroup name="rise" tag="ul" class="list__items">
      <li v-for="(item, i) in list" :key="i" class="list__row">
        <span class="list__plus" aria-hidden="true">+</span>
        <input
          :value="item"
          :placeholder="placeholder"
          :aria-label="`${placeholder ?? ''} ${i + 1}`"
          @input="update(i, ($event.target as HTMLInputElement).value)"
          @keydown.enter.prevent="add"
        />
        <button type="button" class="list__remove" :aria-label="admin.productForm.remove" @click="list = list.filter((_, j) => j !== i)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </li>
    </TransitionGroup>
    <button type="button" class="list__add" @click="add">
      <i class="fa-solid fa-plus" aria-hidden="true"></i> {{ addLabel }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.list {
  @include flex(column, stretch, flex-start, 0.5rem);

  &__items {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.45rem);
  }

  &__row {
    @include flex(row, center, flex-start, 0.4rem);
  }

  // El "+" lima del menú impreso
  &__plus {
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.3rem;
    color: $lime-deep;
    width: 1rem;
  }

  &__remove {
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: $ink-muted;

    &:hover {
      background: $danger-bg;
      color: $danger;
    }
  }

  &__add {
    align-self: flex-start;
    min-height: 44px;
    padding: 0 0.9rem;
    border-radius: $radius-pill;
    font-weight: 700;
    font-size: $text-sm;
    color: $lime-deep;

    &:hover {
      background: $lime-soft;
    }
  }
}
</style>
