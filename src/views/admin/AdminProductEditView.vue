<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import AdminSwitch from '@/components/admin/ui/AdminSwitch.vue'
import MoneyInput from '@/components/admin/ui/MoneyInput.vue'
import ImageUploader from '@/components/admin/products/ImageUploader.vue'
import ListEditor from '@/components/admin/products/ListEditor.vue'
import OptionsEditor from '@/components/admin/products/OptionsEditor.vue'
import { useProductForm } from '@/composables/admin/useProductForm'
import { admin } from '@/config/admin'
import type { ProductBadge } from '@/types'

const t = admin.productForm
const { id, form, categories, loading, saving, uploading, errors, slugTouched, dirty, save, remove } = useProductForm()
const confirmDelete = ref(false)
const badgeKeys = Object.keys(admin.badges) as ProductBadge[]

function toggleBadge(b: ProductBadge) {
  const has = form.value.badges.includes(b)
  form.value.badges = has ? form.value.badges.filter((x) => x !== b) : [...form.value.badges, b]
}
</script>

<template>
  <section class="pedit">
    <RouterLink :to="{ name: 'AdminProducts' }" class="pedit__back">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ admin.products.title }}
    </RouterLink>
    <h1 class="pedit__title">{{ id ? t.editTitle : t.newTitle }}</h1>

    <div v-if="loading" class="pedit__cols">
      <div class="skeleton pedit__ghost pedit__ghost--img"></div>
      <div class="pedit__main"><div v-for="n in 3" :key="n" class="skeleton pedit__ghost"></div></div>
    </div>

    <form v-else class="pedit__cols" novalidate @submit.prevent="save">
      <div class="pedit__side">
        <fieldset class="pedit__card">
          <legend class="pedit__h">{{ t.sections.image }}</legend>
          <ImageUploader v-model="form.image" @busy="uploading = $event" />
        </fieldset>
        <fieldset class="pedit__card">
          <legend class="pedit__h">{{ t.sections.visibility }}</legend>
          <AdminSwitch v-model="form.isPublished" :label="admin.products.published" />
          <AdminSwitch v-model="form.isAvailable" :label="admin.products.available" />
          <AdminSwitch v-model="form.isFeatured" :label="admin.products.featured" />
          <div>
            <label for="p-order">{{ t.order }}</label>
            <input id="p-order" v-model.number="form.order" type="number" inputmode="numeric" min="0" />
          </div>
        </fieldset>
      </div>

      <div class="pedit__main">
        <fieldset class="pedit__card">
          <legend class="pedit__h">{{ t.sections.basics }}</legend>
          <div class="pedit__field" :class="{ 'pedit__field--err': errors.name }">
            <label for="p-name">{{ t.name }}</label>
            <input id="p-name" v-model="form.name" maxlength="80" />
            <small v-if="errors.name">{{ errors.name }}</small>
          </div>
          <div class="pedit__field" :class="{ 'pedit__field--err': errors.slug }">
            <label for="p-slug">{{ t.slug }}</label>
            <input id="p-slug" v-model="form.slug" @input="slugTouched = true" />
            <small v-if="errors.slug">{{ errors.slug }}</small>
          </div>
          <div class="pedit__pair">
            <div class="pedit__field" :class="{ 'pedit__field--err': errors.category }">
              <label for="p-cat">{{ t.category }}</label>
              <select id="p-cat" v-model="form.category">
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
              <small v-if="errors.category">{{ errors.category }}</small>
            </div>
            <div class="pedit__field" :class="{ 'pedit__field--err': errors.price }">
              <label for="p-price">{{ t.price }}</label>
              <MoneyInput id="p-price" v-model="form.price" />
              <small v-if="errors.price">{{ errors.price }}</small>
            </div>
          </div>
          <div class="pedit__field">
            <label for="p-desc">{{ t.description }}</label>
            <textarea id="p-desc" v-model="form.description" rows="3"></textarea>
          </div>
        </fieldset>

        <fieldset class="pedit__card">
          <legend class="pedit__h">{{ t.sections.includes }}</legend>
          <ListEditor v-model="form.includes" :placeholder="t.includePlaceholder" :add-label="t.includeAdd" />
        </fieldset>

        <fieldset class="pedit__card">
          <legend class="pedit__h">{{ t.sections.badges }}</legend>
          <div class="pedit__chips">
            <button
              v-for="b in badgeKeys"
              :key="b"
              type="button"
              class="pedit__chip"
              :class="{ 'pedit__chip--on': form.badges.includes(b) }"
              :aria-pressed="form.badges.includes(b)"
              @click="toggleBadge(b)"
            >
              {{ admin.badges[b] }}
            </button>
          </div>
        </fieldset>

        <fieldset class="pedit__card" :class="{ 'pedit__card--err': errors.options }">
          <legend class="pedit__h">{{ t.sections.options }}</legend>
          <OptionsEditor v-model="form.options" />
          <small v-if="errors.options" class="pedit__err">{{ errors.options }}</small>
        </fieldset>

        <div class="pedit__bar">
          <button v-if="id" type="button" class="btn btn--ghost pedit__delete" @click="confirmDelete = true">
            <i class="fa-solid fa-trash" aria-hidden="true"></i> {{ t.delete }}
          </button>
          <button type="submit" class="btn btn--dark" :disabled="saving || uploading || (!!id && !dirty)">
            <i class="fa-solid fa-check" aria-hidden="true"></i> {{ t.save }}
          </button>
        </div>
      </div>
    </form>

    <BaseModal
      :open="confirmDelete"
      :title="t.deleteTitle"
      :message="t.deleteText"
      :confirm-label="t.delete"
      danger
      @confirm="(confirmDelete = false), remove()"
      @cancel="confirmDelete = false"
    />
  </section>
</template>

<style scoped lang="scss">
.pedit {
  @include flex(column, stretch, flex-start, 1rem);
  padding-bottom: 5rem;

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    align-self: flex-start;
    min-height: 44px;
    font-weight: 700;
    color: $ink-soft;
  }

  &__title {
    @include display($display-sm, 700);
  }

  &__cols {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__side {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex: 0 0 340px;
      position: sticky;
      top: 1.5rem;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__card {
    @include card;
    border: 1px solid $line;
    padding: 1.1rem;
    @include flex(column, stretch, flex-start, 0.75rem);

    &--err {
      border-color: $danger;
    }
  }

  &__h {
    @include eyebrow;
    color: $ink-muted;
    float: left; // saca la legend del borde del fieldset
    width: 100%;
  }

  &__pair {
    @include flex-cards(180px, 0.75rem);
  }

  &__field {
    small {
      display: block;
      margin-top: 0.3rem;
      color: $danger;
      font-weight: 600;
      font-size: $text-xs;
    }

    &--err input,
    &--err select,
    &--err :deep(input) {
      border-color: $danger;
    }
  }

  &__err {
    color: $danger;
    font-weight: 600;
  }

  &__chips {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
  }

  &__chip {
    min-height: 44px;
    padding: 0 1.1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    font-weight: 700;
    font-size: $text-sm;
    transition:
      background-color 0.2s ease,
      transform 0.15s $ease;

    &:active {
      transform: scale(0.94);
    }

    &--on {
      background: $lime;
      border-color: $lime;
    }
  }

  // Barra de guardar pegada abajo mientras se edita
  &__bar {
    position: sticky;
    bottom: calc(72px + env(safe-area-inset-bottom));
    @include flex(row, center, flex-end, 0.6rem);
    padding: 0.75rem;
    border-radius: $radius-md;
    background: rgba($surface, 0.94);
    backdrop-filter: blur(8px);
    box-shadow: $shadow-md;

    @include from('lg') {
      bottom: 1rem;
    }
  }

  &__delete {
    margin-right: auto;
    color: $danger;
  }

  &__ghost {
    height: 220px;
    border-radius: 14px;

    &--img {
      flex: 0 0 340px;
      height: 340px;
    }
  }
}
</style>
