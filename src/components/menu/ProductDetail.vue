<script setup lang="ts">
import { nextTick, ref, toRef } from 'vue'
import { gsap } from 'gsap'
import PriceTag from '@/components/ui/PriceTag.vue'
import QtyStepper from '@/components/ui/QtyStepper.vue'
import ProductBadges from './ProductBadges.vue'
import ProductOptions from './ProductOptions.vue'
import { useProductForm } from '@/composables/useProductForm'
import { flyToCart } from '@/composables/useFlyToCart'
import { useCartStore } from '@/stores/cart'
import { formatCents, imageUrl } from '@/utils/format'
import { site } from '@/config/site'
import { home } from '@/config/home'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; mode?: 'sheet' | 'page' }>()
const emit = defineEmits<{ added: [] }>()

const cart = useCartStore()
const form = useProductForm(toRef(props, 'product'))
const { choices, qty, note, showErrors, missing, total } = form
const root = ref<HTMLElement | null>(null)
const img = ref<HTMLImageElement | null>(null)
const loaded = ref(false)

async function add() {
  if (form.submit()) {
    flyToCart(img.value)
    emit('added')
    return
  }
  // Falta elegir: llevar la vista al primer grupo pendiente y sacudirlo con cariño.
  await nextTick()
  const el = root.value?.querySelector<HTMLElement>(`[data-option="${CSS.escape(missing.value[0] ?? '')}"]`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  gsap.fromTo(el, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
}
</script>

<template>
  <div ref="root" class="pd" :class="[`pd--${mode ?? 'sheet'}`, { 'pd--lifted': mode === 'page' && cart.count > 0 }]">
    <div class="pd__media" :class="{ skeleton: !loaded }">
      <img
        ref="img"
        class="pd__img"
        :class="{ 'pd__img--in': loaded }"
        :src="imageUrl(product.image)"
        :alt="product.name"
        width="1200"
        height="1200"
        fetchpriority="high"
        @load="loaded = true"
        @error="loaded = true"
      />
      <ProductBadges class="pd__badges" :badges="product.badges" />
    </div>

    <div class="pd__info">
      <component :is="mode === 'page' ? 'h1' : 'h2'" class="pd__name">{{ product.name }}</component>
      <PriceTag :cents="product.price" size="xl" class="pd__price" />
      <p v-if="product.description" class="pd__desc">{{ product.description }}</p>

      <div v-if="product.includes.length" class="pd__includes">
        <h3 class="pd__label">{{ home.product.includes }}</h3>
        <ul>
          <li v-for="inc in product.includes" :key="inc">{{ inc }}</li>
        </ul>
      </div>

      <ProductOptions
        v-if="product.options.length"
        :options="product.options"
        :choices="choices"
        :missing="missing"
        :show-errors="showErrors"
        @toggle="form.toggle"
      />

      <label class="pd__note">
        <span class="pd__label">{{ home.product.note }}</span>
        <textarea v-model="note" rows="2" maxlength="140" :placeholder="home.product.notePlaceholder"></textarea>
      </label>

      <div class="pd__bar">
        <QtyStepper v-model="qty" />
        <button type="button" class="btn btn--cta pd__add" :disabled="!product.isAvailable" @click="add">
          <template v-if="product.isAvailable">
            {{ home.product.add }} ·
            <Transition name="qty-pop" mode="out-in">
              <span :key="total" class="pd__total">{{ formatCents(total) }}</span>
            </Transition>
          </template>
          <template v-else>{{ site.shop.soldOut }}</template>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pd {
  @include flex(column, stretch, flex-start);

  @include from('md') {
    flex-direction: row;
    align-items: flex-start;
    gap: 2.5rem;
  }

  &__media {
    position: relative;
    aspect-ratio: 1;
    background: $surface;
    border-radius: $radius-lg;
    overflow: hidden;

    @include from('md') {
      flex: 1 1 46%;
      position: sticky;
      top: calc(var(--header-h) + 1rem);
    }
  }

  &--sheet &__media {
    margin: 0 auto;
    width: min(100%, 420px);

    @include from('md') {
      top: 0;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    transform: scale(0.94) rotate(-3deg);
    transition:
      opacity 0.5s ease,
      transform 0.7s $ease;

    &--in {
      opacity: 1;
      transform: none;
    }
  }

  &__badges {
    position: absolute;
    top: 1rem;
    left: 1rem;
  }

  &__info {
    @include flex(column, stretch, flex-start, 1rem);
    padding-top: 1.2rem;

    @include from('md') {
      flex: 1 1 54%;
      padding-top: 0;
    }
  }

  &__name {
    @include display($display-sm, 700);
  }

  &__price {
    color: $coral-deep;
  }

  &__desc {
    color: $ink-soft;
  }

  &__label {
    @include eyebrow;
    display: block;
    margin-bottom: 0.45rem;
  }

  &__includes ul {
    list-style: none;
    @include flex(column, flex-start, flex-start, 0.25rem);

    li::before {
      content: '+';
      font-family: $font-display;
      font-weight: 700;
      color: $lime-deep;
      margin-right: 0.45rem;
    }
  }

  &__note textarea {
    resize: none;
    font-size: 16px; // < 16px hace zoom en iOS
  }

  // Barra de compra pegada abajo mientras se baja por las opciones.
  &__bar {
    position: sticky;
    bottom: 0;
    z-index: 2;
    @include flex(row, center, space-between, 0.75rem);
    margin: 0.5rem -1.25rem 0;
    padding: 0.85rem 1.25rem calc(0.85rem + env(safe-area-inset-bottom));
    background: rgba($surface, 0.94);
    backdrop-filter: blur(10px);
    border-top: 1px solid $line;

    @include from('md') {
      margin-inline: 0;
      padding-inline: 0;
    }
  }

  // En la página, la CartBar fija (móvil, ~72px) taparía la barra de compra.
  &--lifted &__bar {
    @include until('md') {
      bottom: 76px;
    }
  }

  &__add {
    flex: 1;
    font-size: 1.05rem;
  }

  &__total {
    display: inline-block;
    font-variant-numeric: tabular-nums;
  }
}

.qty-pop-enter-active,
.qty-pop-leave-active {
  transition:
    transform 0.18s $ease,
    opacity 0.18s ease;
}
.qty-pop-enter-from {
  transform: translateY(-60%);
  opacity: 0;
}
.qty-pop-leave-to {
  transform: translateY(60%);
  opacity: 0;
}
</style>
