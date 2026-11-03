<script setup lang="ts">
import { computed } from 'vue'
import { useMenu } from '@/composables/useMenu'
import { useCheckout } from '@/composables/useCheckout'
import { useCartStore } from '@/stores/cart'
import ChoiceCard from './ChoiceCard.vue'
import { formatCents } from '@/utils/format'
import { checkoutCopy } from '@/config/checkout'
import type { Fulfillment } from '@/types'

const { settings } = useMenu()
const { form } = useCheckout()
const cart = useCartStore()
const copy = checkoutCopy.checkout.fulfillment

const deliveryCost = computed(() => {
  const s = settings.value
  if (!s) return ''
  const free = s.freeDeliveryFrom > 0 && cart.subtotal >= s.freeDeliveryFrom
  return free || !s.deliveryFee ? copy.free : formatCents(s.deliveryFee)
})

function pick(f: Fulfillment) {
  form.fulfillment = f
  // con una sola sucursal no hay nada que elegir
  if (f === 'pickup' && !form.branch && settings.value?.branches.length === 1) form.branch = settings.value.branches[0]!.name
}
</script>

<template>
  <div class="ful" role="radiogroup" :aria-label="checkoutCopy.checkout.sections.fulfillment">
    <ChoiceCard
      :selected="form.fulfillment === 'delivery'"
      :icon="copy.delivery.icon"
      :label="copy.delivery.label"
      :text="copy.delivery.text"
      :meta="`${settings?.deliveryEta ?? ''} · ${deliveryCost}`"
      @select="pick('delivery')"
    />
    <ChoiceCard
      :selected="form.fulfillment === 'pickup'"
      :icon="copy.pickup.icon"
      :label="copy.pickup.label"
      :text="copy.pickup.text"
      :meta="`${settings?.pickupEta ?? ''} · ${copy.free}`"
      @select="pick('pickup')"
    />
  </div>
</template>

<style scoped lang="scss">
.ful {
  @include flex-cards(220px, 0.75rem);
}
</style>
