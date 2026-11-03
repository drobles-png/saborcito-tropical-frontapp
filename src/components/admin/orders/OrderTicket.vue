<script setup lang="ts">
import { formatCents, formatDate, formatTime } from '@/utils/format'
import { admin } from '@/config/admin'
import { site } from '@/config/site'
import type { Order } from '@/types'

// Comanda para impresora térmica de 80 mm: solo existe al imprimir.
defineProps<{ order: Order }>()
const t = admin.detail
</script>

<template>
  <div class="ticket">
    <p class="ticket__brand">{{ site.name }}</p>
    <p class="ticket__code">{{ order.code }}</p>
    <p>{{ formatDate(order.createdAt) }} · {{ formatTime(order.createdAt) }}</p>
    <p class="ticket__big">{{ admin.fulfillment[order.fulfillment].label.toUpperCase() }}</p>
    <hr />
    <p><b>{{ order.customer.name }}</b> · {{ order.customer.phone }}</p>
    <template v-if="order.fulfillment === 'delivery'">
      <p>{{ order.address.street }}</p>
      <p v-if="order.address.reference">{{ t.reference }}: {{ order.address.reference }}</p>
    </template>
    <p v-else>{{ t.branch }}: {{ order.branch }}</p>
    <hr />
    <div v-for="(item, i) in order.items" :key="i" class="ticket__item">
      <p class="ticket__line">
        <b>{{ item.qty }} × {{ item.name }}</b><span>{{ formatCents(item.lineTotal) }}</span>
      </p>
      <p v-for="opt in item.options" :key="opt.name">&nbsp;&nbsp;{{ opt.name }}: {{ opt.choice }}</p>
      <p v-if="item.note" class="ticket__note">&nbsp;&nbsp;** {{ item.note }}</p>
    </div>
    <p v-if="order.notes" class="ticket__note">{{ t.notes }}: {{ order.notes }}</p>
    <hr />
    <p class="ticket__line"><span>{{ t.subtotal }}</span><span>{{ formatCents(order.subtotal) }}</span></p>
    <p v-if="order.deliveryFee" class="ticket__line">
      <span>{{ t.delivery }}</span><span>{{ formatCents(order.deliveryFee) }}</span>
    </p>
    <p class="ticket__line ticket__big"><span>{{ t.total }}</span><span>{{ formatCents(order.total) }}</span></p>
    <p>
      {{ admin.payMethod[order.paymentMethod] }} · {{ admin.payStatus[order.paymentStatus] }}
      <template v-if="order.cashChangeFor"> · {{ admin.orders.cashChange }} {{ formatCents(order.cashChangeFor) }}</template>
    </p>
  </div>
</template>

<style scoped lang="scss">
.ticket {
  display: none;
}

@media print {
  @page {
    size: 80mm auto;
    margin: 3mm;
  }

  .ticket {
    display: block;
    width: 74mm;
    font-family: 'Courier New', monospace;
    font-size: 11pt;
    line-height: 1.3;
    color: #000;

    hr {
      border: none;
      border-top: 1px dashed #000;
      margin: 2mm 0;
    }

    &__brand {
      text-align: center;
      font-weight: 700;
    }

    &__code {
      text-align: center;
      font-size: 20pt;
      font-weight: 700;
    }

    &__big {
      font-size: 14pt;
      font-weight: 700;
    }

    &__item {
      margin-bottom: 1.5mm;
    }

    &__line {
      display: flex;
      justify-content: space-between;
      gap: 2mm;
    }

    &__note {
      font-weight: 700;
    }
  }
}
</style>
