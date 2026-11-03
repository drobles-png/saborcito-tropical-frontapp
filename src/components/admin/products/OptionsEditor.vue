<script setup lang="ts">
import AdminSwitch from '@/components/admin/ui/AdminSwitch.vue'
import MoneyInput from '@/components/admin/ui/MoneyInput.vue'
import { admin } from '@/config/admin'
import type { ProductOption } from '@/types'

// Se edita el arreglo en sitio: el padre lo tiene en un ref reactivo.
const options = defineModel<ProductOption[]>({ required: true })
const t = admin.productForm

function addGroup() {
  options.value.push({ name: '', required: true, choices: [{ label: '', priceDelta: 0 }] })
}
</script>

<template>
  <div class="opts">
    <TransitionGroup name="rise" tag="div" class="opts__groups">
      <fieldset v-for="(opt, i) in options" :key="i" class="opts__group">
        <div class="opts__head">
          <div class="opts__field">
            <label :for="`opt-${i}`">{{ t.optionName }}</label>
            <input :id="`opt-${i}`" v-model="opt.name" placeholder="ej. Sabor del yogurt" />
          </div>
          <AdminSwitch v-model="opt.required" :label="t.optionRequired" />
          <button type="button" class="opts__icon" :aria-label="t.remove" @click="options.splice(i, 1)">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>

        <div v-for="(c, j) in opt.choices" :key="j" class="opts__choice">
          <input v-model="c.label" :placeholder="t.choiceLabel" :aria-label="`${t.choiceLabel} ${j + 1}`" class="opts__label" />
          <MoneyInput v-model="c.priceDelta" :placeholder="t.choiceDelta" class="opts__delta" />
          <button type="button" class="opts__icon" :aria-label="t.remove" @click="opt.choices.splice(j, 1)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <button type="button" class="opts__add" @click="opt.choices.push({ label: '', priceDelta: 0 })">
          <i class="fa-solid fa-plus" aria-hidden="true"></i> {{ t.choiceAdd }}
        </button>
      </fieldset>
    </TransitionGroup>
    <button type="button" class="btn btn--ghost btn--sm opts__new" @click="addGroup">
      <i class="fa-solid fa-plus" aria-hidden="true"></i> {{ t.optionsAdd }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.opts {
  @include flex(column, stretch, flex-start, 0.75rem);

  &__groups {
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__group {
    border: 1px solid $line;
    border-radius: $radius-md;
    background: $paper;
    padding: 0.85rem;
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__head {
    @include flex(row, flex-end, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-bottom: 0.25rem;
  }

  &__field {
    flex: 1 1 200px;
  }

  &__choice {
    @include flex(row, center, flex-start, 0.4rem);
  }

  &__label {
    flex: 1;
    min-width: 0;
  }

  &__delta {
    flex: 0 0 110px;
  }

  &__icon {
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
    padding: 0 0.8rem;
    border-radius: $radius-pill;
    font-weight: 700;
    font-size: $text-sm;
    color: $lime-deep;
  }

  &__new {
    align-self: flex-start;
  }
}
</style>
