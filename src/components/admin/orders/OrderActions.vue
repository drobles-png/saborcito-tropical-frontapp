<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { nextLabel, nextStatus, useOrderActions } from '@/composables/admin/useOrderActions'
import { admin } from '@/config/admin'
import type { Order } from '@/types'

const props = defineProps<{ order: Order; showDetail?: boolean }>()
const t = admin.orders

const { busy, advance, togglePaid, cancel } = useOrderActions()
const menuOpen = ref(false)
const confirmCancel = ref(false)

const next = computed(() => nextStatus(props.order))
const closed = computed(() => ['delivered', 'cancelled'].includes(props.order.status))
const isBusy = computed(() => busy.value === props.order.id)

function pick(fn: () => void) {
  menuOpen.value = false
  fn()
}

async function doCancel() {
  confirmCancel.value = false
  await cancel(props.order)
}
</script>

<template>
  <div class="actions">
    <button
      v-if="next"
      class="actions__next"
      :class="`actions__next--${next}`"
      :disabled="isBusy"
      @click="advance(order)"
    >
      {{ nextLabel(order) }}
      <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </button>

    <div class="actions__more">
      <button
        class="actions__dots"
        :aria-label="t.more"
        :aria-expanded="menuOpen"
        aria-haspopup="menu"
        @click="menuOpen = !menuOpen"
      >
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </button>
      <Transition name="menu">
        <div v-if="menuOpen" class="actions__menu" role="menu">
          <RouterLink
            v-if="showDetail"
            :to="{ name: 'AdminOrderDetail', params: { id: order.id } }"
            class="actions__item"
            role="menuitem"
          >
            <i class="fa-solid fa-eye" aria-hidden="true"></i> {{ t.detail }}
          </RouterLink>
          <button class="actions__item" role="menuitem" @click="pick(() => togglePaid(order))">
            <i class="fa-solid fa-sack-dollar" aria-hidden="true"></i>
            {{ order.paymentStatus === 'paid' ? t.markPending : t.markPaid }}
          </button>
          <button
            v-if="!closed"
            class="actions__item actions__item--danger"
            role="menuitem"
            @click="pick(() => (confirmCancel = true))"
          >
            <i class="fa-solid fa-ban" aria-hidden="true"></i> {{ t.cancel }}
          </button>
        </div>
      </Transition>
      <div v-if="menuOpen" class="actions__scrim" @click="menuOpen = false"></div>
    </div>

    <BaseModal
      :open="confirmCancel"
      :title="t.cancelTitle"
      :message="`${order.code} · ${order.customer.name}. ${t.cancelText}`"
      :confirm-label="t.cancel"
      :cancel-label="t.keep"
      danger
      @confirm="doCancel"
      @cancel="confirmCancel = false"
    />
  </div>
</template>

<style scoped lang="scss">
.actions {
  @include flex(row, stretch, flex-end, 0.5rem);

  &__next {
    flex: 1;
    @include flex(row, center, center, 0.6rem);
    min-height: 56px;
    padding: 0 1.25rem;
    border-radius: $radius-md;
    font-family: $font-display;
    font-size: 1.2rem;
    font-weight: 700;
    background: $ink;
    color: $surface;
    -webkit-tap-highlight-color: transparent;
    transition:
      transform 0.15s $ease,
      background-color 0.2s ease,
      opacity 0.2s ease;

    &:active {
      transform: scale(0.97);
    }

    &:disabled {
      opacity: 0.55;
    }

    // El color del botón anticipa el estado al que lleva
    &--preparing {
      background: $coral-deep;
    }
    &--ready {
      background: $lime;
      color: $ink;
    }
    &--on_the_way {
      background: $info;
    }
    &--delivered {
      background: $success;
    }
  }

  &__more {
    position: relative;
    margin-left: auto;
  }

  &__dots {
    width: 56px;
    height: 56px;
    border-radius: $radius-md;
    background: $sand;
    color: $ink;
    font-size: 1.1rem;
  }

  &__scrim {
    position: fixed;
    inset: 0;
    z-index: 20;
  }

  &__menu {
    position: absolute;
    right: 0;
    bottom: calc(100% + 0.4rem);
    z-index: 21;
    min-width: 220px;
    @include card;
    box-shadow: $shadow-md;
    padding: 0.35rem;
    @include flex(column, stretch, flex-start);
    transform-origin: bottom right;
  }

  &__item {
    @include flex(row, center, flex-start, 0.7rem);
    min-height: 46px;
    padding: 0 0.85rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: $text-sm;
    text-align: left;

    i {
      width: 1rem;
      color: $ink-muted;
    }

    &:hover {
      background: $sand;
    }

    &--danger,
    &--danger i {
      color: $danger;
    }
  }
}

.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.18s $ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(4px);
}
</style>
