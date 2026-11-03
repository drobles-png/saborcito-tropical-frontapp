<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { renderPayphone } from '@/composables/usePayphone'
import { useBodyScroll } from '@/composables/useBodyScroll'
import PriceTag from '@/components/ui/PriceTag.vue'
import { checkoutCopy } from '@/config/checkout'
import type { CreateOrderResponse } from '@/types'

const props = defineProps<{
  config: NonNullable<CreateOrderResponse['payphone']>
  code: string
  buyer: { email: string; phone: string }
}>()
const emit = defineEmits<{ close: [] }>()
const copy = checkoutCopy.payphone
const state = ref<'loading' | 'ready' | 'error'>('loading')
const box = ref<HTMLElement | null>(null)
let observer: MutationObserver | null = null

useBodyScroll(ref(true))

// El skeleton se quita cuando Payphone ya pintó su formulario dentro del contenedor.
async function mount() {
  state.value = 'loading'
  await nextTick()
  observer?.disconnect()
  observer = new MutationObserver(() => {
    if (box.value?.childElementCount) {
      state.value = 'ready'
      observer?.disconnect()
    }
  })
  if (box.value) observer.observe(box.value, { childList: true, subtree: true })
  try {
    await renderPayphone(props.config, props.buyer)
  } catch {
    state.value = 'error'
  }
}

onMounted(mount)
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <Teleport to="body">
    <div class="pp" @keydown.esc="emit('close')">
      <div class="pp__overlay" @click="emit('close')"></div>
      <div class="pp__box" role="dialog" aria-modal="true" :aria-label="copy.title">
        <header class="pp__head">
          <div>
            <p class="pp__eyebrow">{{ copy.order(code) }}</p>
            <h2 class="pp__title">{{ copy.title }}</h2>
          </div>
          <button type="button" class="pp__close" :aria-label="copy.close" @click="emit('close')">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </header>
        <div class="pp__amount">
          <PriceTag :cents="config.amount" size="lg" />
          <span><i class="fa-solid fa-lock" aria-hidden="true"></i> {{ copy.lead }}</span>
        </div>

        <div v-if="state === 'loading'" class="pp__skeleton" aria-hidden="true">
          <span class="skeleton" style="height: 48px"></span>
          <span class="skeleton" style="height: 48px"></span>
          <span class="skeleton" style="height: 48px; width: 60%"></span>
          <span class="skeleton" style="height: 54px; border-radius: 999px"></span>
        </div>
        <div v-if="state === 'error'" class="pp__error" role="alert">
          <p>{{ copy.loadError }}</p>
          <div class="pp__actions">
            <button type="button" class="btn btn--dark btn--sm" @click="mount">{{ copy.retry }}</button>
            <button type="button" class="btn btn--ghost btn--sm" @click="emit('close')">{{ copy.otherMethod }}</button>
          </div>
        </div>
        <div id="pp-button" ref="box" class="pp__form" :class="{ 'pp__form--hidden': state !== 'ready' }"></div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.pp {
  position: fixed;
  inset: 0;
  z-index: 260;
  @include flex(column, stretch, flex-end);

  @include from('md') {
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: $overlay;
    animation: pp-fade 0.3s ease;
  }

  &__box {
    position: relative;
    width: 100%;
    max-height: 94dvh;
    overflow-y: auto;
    background: $surface;
    border-radius: $radius-lg $radius-lg 0 0;
    padding: 1.25rem 1.1rem calc(1.25rem + env(safe-area-inset-bottom));
    box-shadow: $shadow-lg;
    animation: pp-up 0.42s $ease;

    @include from('md') {
      max-width: 480px;
      border-radius: $radius-lg;
      padding: 1.6rem;
    }
  }

  &__head {
    @include flex(row, flex-start, space-between, 1rem);
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__close {
    width: 44px;
    height: 44px;
    flex: 0 0 44px;
    border-radius: 50%;
    background: $sand;
  }

  &__amount {
    @include flex(column, flex-start, flex-start, 0.4rem);
    margin: 1rem 0;
    padding: 1rem;
    border-radius: $radius-md;
    background: $lime-soft;

    span {
      font-size: $text-xs;
      color: $ink-soft;
    }
  }

  &__skeleton {
    @include flex(column, stretch, flex-start, 0.7rem);
  }

  &__error {
    padding: 1rem;
    border-radius: $radius-md;
    background: $danger-bg;
    color: $ink;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }

  &__form {
    min-height: 40px;

    &--hidden {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
  }
}

@keyframes pp-fade {
  from {
    opacity: 0;
  }
}

@keyframes pp-up {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
}
</style>
