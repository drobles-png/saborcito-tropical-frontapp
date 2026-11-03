<script setup lang="ts">
import AdminSwitch from '@/components/admin/ui/AdminSwitch.vue'
import { admin } from '@/config/admin'
import type { Category } from '@/types'

const draft = defineModel<Pick<Category, 'name' | 'slug' | 'icon' | 'tagline' | 'isActive'>>({ required: true })
defineProps<{ saving: boolean }>()
const emit = defineEmits<{ save: []; cancel: []; slugEdit: [] }>()
const t = admin.categories
</script>

<template>
  <form class="cform" novalidate @submit.prevent="emit('save')">
    <div class="cform__row">
      <span class="cform__preview" aria-hidden="true"><i :class="draft.icon || 'fa-solid fa-question'"></i></span>
      <div class="cform__field">
        <label for="c-name">{{ t.name }}</label>
        <input id="c-name" v-model="draft.name" maxlength="60" />
      </div>
    </div>
    <div class="cform__pair">
      <div class="cform__field">
        <label for="c-slug">{{ t.slug }}</label>
        <input id="c-slug" v-model="draft.slug" @input="emit('slugEdit')" />
      </div>
      <div class="cform__field">
        <label for="c-icon">{{ t.icon }}</label>
        <input id="c-icon" v-model="draft.icon" :placeholder="t.iconHint" autocapitalize="off" />
      </div>
    </div>
    <div class="cform__field">
      <label for="c-tag">{{ t.tagline }}</label>
      <input id="c-tag" v-model="draft.tagline" maxlength="120" />
    </div>
    <div class="cform__actions">
      <AdminSwitch v-model="draft.isActive" :label="t.active" />
      <button type="button" class="btn btn--ghost btn--sm" @click="emit('cancel')">{{ t.cancel }}</button>
      <button type="submit" class="btn btn--dark btn--sm" :disabled="saving">{{ t.save }}</button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.cform {
  @include flex(column, stretch, flex-start, 0.75rem);
  padding: 1rem;
  background: $lime-soft;
  animation: open 0.3s $ease;

  &__row {
    @include flex(row, flex-end, flex-start, 0.75rem);
  }

  &__preview {
    flex: none;
    width: 48px;
    height: 48px;
    border-radius: $radius-sm;
    background: $lime;
    @include flex(row, center, center);
    font-size: 1.3rem;
  }

  &__field {
    flex: 1;
    min-width: 0;
  }

  &__pair {
    @include flex-cards(200px, 0.75rem);
  }

  &__actions {
    @include flex(row, center, flex-end, 0.5rem);
    flex-wrap: wrap;

    > :first-child {
      margin-right: auto;
    }
  }
}

@keyframes open {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}
</style>
