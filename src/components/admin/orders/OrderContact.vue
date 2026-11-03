<script setup lang="ts">
import { computed } from 'vue'
import { waNumber } from '@/composables/admin/useOrderActions'
import { admin } from '@/config/admin'
import { site } from '@/config/site'
import type { Order } from '@/types'

const props = defineProps<{ order: Order }>()
const t = admin.detail

const mapsUrl = computed(() => {
  const a = props.order.address
  const query = a.lat != null && a.lng != null ? `${a.lat},${a.lng}` : a.street
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
})

const waUrl = computed(() => {
  const { customer, code } = props.order
  const text = `Hola ${customer.name}, te escribimos de ${site.name} por tu pedido ${code}.`
  return `https://wa.me/${waNumber(customer.phone)}?text=${encodeURIComponent(text)}`
})
</script>

<template>
  <div class="contact">
    <section class="contact__block">
      <h2 class="contact__h">{{ t.customer }}</h2>
      <p class="contact__name">{{ order.customer.name }}</p>
      <p class="contact__muted">
        {{ order.customer.phone }}<template v-if="order.customer.email"> · {{ order.customer.email }}</template>
      </p>
      <div class="contact__btns">
        <a :href="waUrl" target="_blank" rel="noopener" class="btn btn--lime btn--sm">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ t.whatsapp }}
        </a>
        <a :href="`tel:${order.customer.phone}`" class="btn btn--ghost btn--sm">
          <i class="fa-solid fa-phone" aria-hidden="true"></i> {{ t.call }}
        </a>
      </div>
    </section>

    <section v-if="order.fulfillment === 'delivery'" class="contact__block">
      <h2 class="contact__h">{{ t.address }}</h2>
      <p>{{ order.address.street }}</p>
      <p v-if="order.address.reference" class="contact__muted">{{ t.reference }}: {{ order.address.reference }}</p>
      <a :href="mapsUrl" target="_blank" rel="noopener" class="contact__link">
        <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i> {{ t.maps }}
      </a>
    </section>
    <section v-else class="contact__block">
      <h2 class="contact__h">{{ t.branch }}</h2>
      <p>{{ order.branch }}</p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.contact {
  @include card;
  padding: 1.1rem;
  @include flex(column, stretch, flex-start, 1.1rem);

  &__block + &__block {
    border-top: 1px dashed $line;
    padding-top: 1.1rem;
  }

  &__h {
    @include eyebrow;
    color: $ink-muted;
    margin-bottom: 0.4rem;
  }

  &__name {
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 600;
  }

  &__muted {
    color: $ink-soft;
    font-size: $text-sm;
    word-break: break-word;
  }

  &__btns {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    margin-top: 0.7rem;

    .btn {
      min-height: 44px;
    }
  }

  &__link {
    @include flex(row, center, flex-start, 0.45rem);
    min-height: 44px;
    font-weight: 700;
    color: $lime-deep;
  }
}
</style>
