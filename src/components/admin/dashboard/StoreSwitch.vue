<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { admin } from '@/config/admin'
import type { ApiError } from '@/types'

const t = admin.dashboard
const toast = useToastStore()
const open = ref<boolean | null>(null)
const asking = ref(false)
const saving = ref(false)

onMounted(async () => {
  try {
    open.value = (await adminService.settings()).storeOpen
  } catch (e) {
    toast.error((e as ApiError).message || admin.genericError)
  }
})

async function confirm() {
  asking.value = false
  const next = !open.value
  open.value = next // optimista
  saving.value = true
  try {
    open.value = (await adminService.updateSettings({ storeOpen: next })).storeOpen
    toast.success(next ? t.storeOpen : t.storeClosed)
  } catch (e) {
    open.value = !next
    toast.error((e as ApiError).message || admin.genericError)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div v-if="open === null" class="skeleton store store--ghost"></div>
  <button
    v-else
    class="store"
    :class="{ 'store--open': open }"
    role="switch"
    :aria-checked="open"
    :disabled="saving"
    @click="asking = true"
  >
    <span class="store__knob" aria-hidden="true">
      <i :class="open ? 'fa-solid fa-store' : 'fa-solid fa-store-slash'"></i>
    </span>
    <span class="store__label">{{ open ? t.storeOpen : t.storeClosed }}</span>
  </button>

  <BaseModal
    :open="asking"
    :title="open ? t.confirmClose : t.confirmOpen"
    :message="open ? t.confirmCloseText : t.confirmOpenText"
    :confirm-label="open ? t.storeClosed : t.storeOpen"
    :danger="!!open"
    @confirm="confirm"
    @cancel="asking = false"
  />
</template>

<style scoped lang="scss">
.store {
  @include flex(row, center, flex-start, 0.75rem);
  min-height: 60px;
  width: 100%;
  padding: 0.4rem 1.2rem 0.4rem 0.4rem;
  border-radius: $radius-pill;
  background: $ink;
  color: $surface;
  font-family: $font-display;
  font-weight: 700;
  font-size: 1.1rem;
  transition: background-color 0.35s ease;
  -webkit-tap-highlight-color: transparent;

  @include from('md') {
    width: auto;
    min-width: 260px;
  }

  &--ghost {
    height: 60px;
    border-radius: $radius-pill;
  }

  &--open {
    background: $lime;
    color: $ink;
  }

  &:disabled {
    opacity: 0.7;
  }

  &__knob {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: $surface;
    color: $coral-deep;
    @include flex(row, center, center);
    font-size: 1.1rem;
    box-shadow: $shadow-sm;
    transition:
      transform 0.4s $ease,
      color 0.3s ease;
  }

  &--open &__knob {
    color: $lime-deep;
    transform: rotate(-8deg) scale(1.04);
  }

  // Punto que late cuando la tienda recibe pedidos
  &--open &__label::after {
    content: '';
    display: inline-block;
    width: 0.55rem;
    height: 0.55rem;
    margin-left: 0.55rem;
    border-radius: 50%;
    background: $success;
    vertical-align: middle;
    animation: live 1.6s ease-in-out infinite;
  }
}

@keyframes live {
  50% {
    opacity: 0.25;
  }
}
</style>
