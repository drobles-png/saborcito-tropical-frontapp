<script setup lang="ts">
import { admin } from '@/config/admin'
import type { Branch } from '@/types'

const branches = defineModel<Branch[]>({ required: true })
const t = admin.settings
</script>

<template>
  <div class="branches">
    <TransitionGroup name="rise" tag="div" class="branches__list">
      <div v-for="(b, i) in branches" :key="i" class="branches__item">
        <div class="branches__fields">
          <div>
            <label :for="`b-name-${i}`">{{ t.branchName }}</label>
            <input :id="`b-name-${i}`" v-model="b.name" />
          </div>
          <div>
            <label :for="`b-addr-${i}`">{{ t.branchAddress }}</label>
            <input :id="`b-addr-${i}`" v-model="b.address" />
          </div>
          <div>
            <label :for="`b-maps-${i}`">{{ t.branchMaps }}</label>
            <input :id="`b-maps-${i}`" v-model="b.mapsUrl" type="url" inputmode="url" placeholder="https://maps.app.goo.gl/…" />
          </div>
        </div>
        <button type="button" class="branches__remove" :aria-label="`${admin.productForm.remove}: ${b.name}`" @click="branches.splice(i, 1)">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </TransitionGroup>
    <button type="button" class="btn btn--ghost btn--sm branches__add" @click="branches.push({ name: '', address: '', mapsUrl: '' })">
      <i class="fa-solid fa-plus" aria-hidden="true"></i> {{ t.branchAdd }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.branches {
  @include flex(column, stretch, flex-start, 0.75rem);

  &__list {
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__item {
    @include flex(row, flex-start, flex-start, 0.5rem);
    padding: 0.85rem;
    border: 1px solid $line;
    border-radius: $radius-md;
    background: $paper;
  }

  &__fields {
    flex: 1;
    min-width: 0;
    @include flex-cards(200px, 0.6rem);
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
  }
}
</style>
