<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenu } from '@/composables/useMenu'
import { useOrderTracking } from '@/composables/useOrderTracking'
import { normalizeCode } from '@/composables/useMyOrders'
import OrderHero from '@/components/tracking/OrderHero.vue'
import StatusTimeline from '@/components/tracking/StatusTimeline.vue'
import OrderDetail from '@/components/tracking/OrderDetail.vue'
import TransferPanel from '@/components/tracking/TransferPanel.vue'
import { site, whatsappLink } from '@/config/site'
import { checkoutCopy } from '@/config/checkout'

const route = useRoute()
const router = useRouter()
const { settings } = useMenu()
const copy = checkoutCopy.tracking

const code = computed(() => normalizeCode(String(route.params.code || '')))
const celebrate = route.query.nuevo === '1' // se lee una vez: al recargar ya no se repite la fiesta
const { order, loading, notFound, error, changed, refresh } = useOrderTracking(code)
const flash = ref(false)

onMounted(() => {
  if (celebrate) router.replace({ query: {} })
})
watch(changed, () => {
  flash.value = false
  requestAnimationFrame(() => (flash.value = true))
  navigator.vibrate?.(60)
})

const eta = computed(() =>
  order.value?.fulfillment === 'pickup' ? settings.value?.pickupEta : settings.value?.deliveryEta,
)
const active = computed(() => order.value && !['delivered', 'cancelled'].includes(order.value.status))
const showTransfer = computed(
  () => order.value?.paymentMethod === 'transfer' && order.value.paymentStatus !== 'paid' && order.value.status !== 'cancelled',
)
const helpUrl = computed(() => whatsappLink(settings.value?.whatsapp ?? '', copy.helpMessage(code.value)))
</script>

<template>
  <div class="track">
    <div class="track__inner">
      <div v-if="loading" class="track__skel" aria-busy="true">
        <span class="skeleton" style="width: 60%; height: 44px; margin: 1.5rem auto 0"></span>
        <span class="skeleton" style="width: 220px; height: 56px; margin: 0 auto"></span>
        <span class="skeleton" style="height: 260px; border-radius: 18px"></span>
        <span class="skeleton" style="height: 200px; border-radius: 18px"></span>
      </div>

      <div v-else-if="notFound || (!order && error)" class="track__empty">
        <img src="/brand/tile-5.webp" alt="" width="120" height="120" />
        <h1>{{ notFound ? copy.notFoundTitle : copy.errorText }}</h1>
        <p v-if="notFound">{{ copy.notFoundText }}</p>
        <button v-if="!notFound" type="button" class="btn btn--dark" @click="refresh">{{ copy.retry }}</button>
        <RouterLink to="/pedido" class="btn btn--lime">{{ copy.tryAgain }}</RouterLink>
      </div>

      <template v-else-if="order">
        <OrderHero :code="order.code" :celebrate="celebrate" />

        <div class="track__cols">
          <div class="track__col">
            <section v-if="order.status === 'cancelled'" class="track__card track__card--cancel" role="status">
              <i class="fa-solid fa-ban" aria-hidden="true"></i>
              <h2>{{ copy.cancelledTitle }}</h2>
              <p>{{ site.tracking.steps.cancelled.text }}</p>
              <RouterLink to="/menu" class="btn btn--lime btn--sm">{{ copy.newOrder }}</RouterLink>
            </section>
            <section v-else class="track__card" :class="{ 'track__card--flash': flash }" @animationend="flash = false">
              <div class="track__meta">
                <span v-if="eta && active"><i class="fa-regular fa-clock" aria-hidden="true"></i> {{ copy.eta }}: <strong>{{ eta }}</strong></span>
                <span v-if="active" class="track__live"><span class="track__live-dot"></span>{{ copy.live }}</span>
              </div>
              <StatusTimeline :order="order" />
            </section>
            <TransferPanel v-if="showTransfer" :order="order" />
          </div>
          <div class="track__col">
            <OrderDetail :order="order" />
            <a :href="helpUrl" target="_blank" rel="noopener" class="track__help">
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
              <span><strong>{{ copy.help }}</strong> {{ copy.helpCta }}</span>
            </a>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.track {
  padding: 1rem 0 4rem;
  background: $paper;

  &__inner {
    @include container(1040px);
  }

  &__skel {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__empty {
    @include flex(column, center, center, 0.9rem);
    text-align: center;
    padding: 3rem 0;

    h1 {
      @include display($display-sm, 700);
    }

    p {
      color: $ink-soft;
      max-width: 36ch;
    }
  }

  &__cols {
    @include flex(column, stretch, flex-start, 1rem);
    margin-top: 1rem;

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: 1.5rem;
    }
  }

  &__col {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__card {
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-md;
    padding: 1.2rem 1.1rem 0.4rem;

    &--flash {
      animation: card-flash 0.9s $ease;
    }

    &--cancel {
      @include flex(column, center, flex-start, 0.5rem);
      text-align: center;
      padding-bottom: 1.4rem;
      background: $danger-bg;
      border-color: rgba($danger, 0.3);

      i {
        font-size: 2rem;
        color: $danger;
      }

      h2 {
        @include display($text-xl, 600);
      }
    }
  }

  &__meta {
    @include flex(row, center, space-between, 0.6rem);
    flex-wrap: wrap;
    margin-bottom: 1.1rem;
    font-size: $text-sm;
  }

  &__live {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-xs;
    font-weight: 700;
    color: $success;
  }

  &__live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $success;
    animation: live 1.4s ease-in-out infinite alternate;
  }

  &__help {
    @include flex(row, center, flex-start, 0.8rem);
    min-height: 60px;
    padding: 0.8rem 1.1rem;
    border-radius: $radius-md;
    border: 2px solid $ink;
    font-size: $text-sm;
    transition: transform 0.16s $ease;

    &:active {
      transform: scale(0.98);
    }

    i {
      font-size: 1.6rem;
      color: $success;
    }
  }
}

@keyframes card-flash {
  30% {
    transform: scale(1.02);
    box-shadow: 0 0 0 6px rgba($lime, 0.6);
  }
}

@keyframes live {
  to {
    opacity: 0.3;
  }
}
</style>
