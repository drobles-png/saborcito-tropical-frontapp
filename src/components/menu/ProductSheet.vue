<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetail from './ProductDetail.vue'
import { useProductSheet } from '@/composables/useProductSheet'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useDialog } from '@/composables/useDialog'

const { product, close } = useProductSheet()
const route = useRoute()
const isOpen = computed(() => !!product.value)
const panel = ref<HTMLElement | null>(null)
const dragY = ref(0)
const dragging = ref(false)

useBodyScroll(isOpen)
useDialog(isOpen, panel, close)

// La URL refleja el producto (compartible y recargable) sin navegar: el router no se entera.
let previousUrl = ''
watch(product, (p, old) => {
  if (p && !old) previousUrl = location.pathname + location.search
  if (p) history.replaceState(history.state, '', `/producto/${p.slug}`)
  else if (previousUrl) {
    history.replaceState(history.state, '', previousUrl)
    previousUrl = ''
  }
})
// Si se navega con el sheet abierto (ej. "Ir a pagar" desde el carrito), se cierra sin tocar la URL nueva.
watch(
  () => route.fullPath,
  () => {
    previousUrl = ''
    close()
  },
)

// Arrastrar hacia abajo desde el asa para cerrar (solo existe en el sheet móvil).
let startY = 0
let startT = 0
function onDown(e: PointerEvent) {
  dragging.value = true
  startY = e.clientY
  startT = e.timeStamp
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function onMove(e: PointerEvent) {
  if (dragging.value) dragY.value = Math.max(0, e.clientY - startY)
}
function onUp(e: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  const velocity = dragY.value / Math.max(1, e.timeStamp - startT)
  if (dragY.value > 120 || velocity > 0.6) close()
  dragY.value = 0
}
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="product" class="sheet" @click.self="close">
        <div
          ref="panel"
          class="sheet__panel"
          :class="{ 'sheet__panel--drag': dragging }"
          :style="dragY ? { transform: `translateY(${dragY}px)` } : undefined"
          role="dialog"
          aria-modal="true"
          :aria-label="product.name"
          tabindex="-1"
        >
          <div class="sheet__grip" @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp">
            <span class="sheet__handle" aria-hidden="true"></span>
          </div>
          <button type="button" class="sheet__close" aria-label="Cerrar" @click="close">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
          <div class="sheet__scroll">
            <ProductDetail :key="product.id" :product="product" mode="sheet" @added="close" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.sheet {
  position: fixed;
  inset: 0;
  z-index: 250;
  background: $overlay;
  backdrop-filter: blur(4px);
  @include flex(column, stretch, flex-end);

  @include from('md') {
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  &__panel {
    position: relative;
    @include flex(column, stretch, flex-start);
    background: $paper;
    border-radius: $radius-lg $radius-lg 0 0;
    max-height: 92svh;
    outline: none;
    transition: transform 0.35s $ease;

    @include from('md') {
      width: min(980px, 100%);
      max-height: min(88vh, 760px);
      border-radius: $radius-lg;
      box-shadow: $shadow-lg;
      overflow: hidden;
    }

    &--drag {
      transition: none;
    }
  }

  &__grip {
    @include flex(row, center, center);
    height: 28px;
    flex-shrink: 0;
    touch-action: none;
    cursor: grab;

    @include from('md') {
      display: none;
    }
  }

  &__handle {
    width: 44px;
    height: 5px;
    border-radius: $radius-pill;
    background: $line;
  }

  &__close {
    position: absolute;
    top: 2rem;
    right: 1.75rem;
    z-index: 3;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: $surface;
    box-shadow: $shadow-sm;
    @include flex(row, center, center);
    font-size: 1.1rem;
    @include focus-ring($coral-deep);

    @include from('md') {
      top: 1rem;
      right: 1rem;
    }
  }

  &__scroll {
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 0 1.25rem;

    @include from('md') {
      padding: 2rem 2rem 0;
    }
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.3s ease;

  .sheet__panel {
    transition: transform 0.45s cubic-bezier(0.32, 0.72, 0, 1);
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .sheet__panel {
    transform: translateY(100%);

    @include from('md') {
      transform: translateY(24px) scale(0.97);
    }
  }
}
</style>
