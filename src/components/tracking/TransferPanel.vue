<script setup lang="ts">
import { computed } from 'vue'
import { useMenu } from '@/composables/useMenu'
import { formatCents } from '@/utils/format'
import { whatsappLink } from '@/config/site'
import { checkoutCopy } from '@/config/checkout'
import type { TrackedOrder } from '@/types'

const props = defineProps<{ order: TrackedOrder }>()
const { settings } = useMenu()
const copy = checkoutCopy.tracking

const receiptUrl = computed(() =>
  whatsappLink(settings.value?.whatsapp ?? '', copy.receiptMessage(props.order.code, formatCents(props.order.total))),
)
</script>

<template>
  <section class="transfer">
    <h2 class="transfer__title">
      <i class="fa-solid fa-building-columns" aria-hidden="true"></i> {{ copy.transferTitle }}
    </h2>
    <p class="transfer__lead">{{ copy.transferText }}</p>
    <pre v-if="settings?.bankInfo" class="transfer__bank">{{ settings.bankInfo }}</pre>
    <a :href="receiptUrl" target="_blank" rel="noopener" class="btn btn--lime btn--block">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.sendReceipt }}
    </a>
  </section>
</template>

<style scoped lang="scss">
.transfer {
  padding: 1.2rem 1.1rem;
  border-radius: $radius-md;
  background: $ink;
  color: $surface;

  &__title {
    @include display($text-lg, 600);

    i {
      color: $lime;
      margin-right: 0.3rem;
    }
  }

  &__lead {
    font-size: $text-sm;
    opacity: 0.8;
    margin: 0.3rem 0 0.8rem;
  }

  &__bank {
    font-family: $font-principal;
    font-size: $text-base;
    font-weight: 600;
    white-space: pre-wrap;
    user-select: all;
    padding: 0.9rem 1rem;
    margin-bottom: 1rem;
    border-radius: $radius-sm;
    background: rgba(#fff, 0.08);
    border: 1px dashed rgba(#fff, 0.3);
  }
}
</style>
