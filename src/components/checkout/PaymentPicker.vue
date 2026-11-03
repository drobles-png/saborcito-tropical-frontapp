<script setup lang="ts">
import { computed, watch } from 'vue'
import { useMenu } from '@/composables/useMenu'
import { useCheckout } from '@/composables/useCheckout'
import ChoiceCard from './ChoiceCard.vue'
import { formatCents } from '@/utils/format'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/checkout'
import type { PaymentMethod } from '@/types'

const { settings } = useMenu()
const { form, total } = useCheckout()
const copy = checkoutCopy.checkout

const methods = computed(() =>
  (['cash', 'transfer', 'card'] as PaymentMethod[]).filter((m) => settings.value?.paymentMethods[m]),
)
// Solo billetes que alcanzan para el total.
const bills = computed(() => [500, 1000, 2000, 5000].filter((b) => b > total.value))
const change = computed(() => (form.cashChangeFor ? form.cashChangeFor - total.value : 0))
// si cambia el total (p. ej. al pasar a delivery) y el billete ya no alcanza, se vuelve a preguntar
watch(bills, (list) => {
  if (form.cashChangeFor && !list.includes(form.cashChangeFor)) form.cashChangeFor = null
})
</script>

<template>
  <div class="pay">
    <div class="pay__list" role="radiogroup" :aria-label="copy.sections.payment">
      <ChoiceCard
        v-for="m in methods"
        :key="m"
        :selected="form.paymentMethod === m"
        :icon="site.payment[m].icon"
        :label="site.payment[m].label"
        :text="site.payment[m].text"
        @select="form.paymentMethod = m"
      />
    </div>

    <Transition name="rise" mode="out-in">
      <div v-if="form.paymentMethod === 'cash'" key="cash" class="pay__extra">
        <p class="pay__q">{{ copy.cash.question }}</p>
        <div class="pay__chips" role="radiogroup" :aria-label="copy.cash.question">
          <button
            v-for="b in bills"
            :key="b"
            type="button"
            role="radio"
            class="pay__chip"
            :class="{ 'pay__chip--on': form.cashChangeFor === b }"
            :aria-checked="form.cashChangeFor === b"
            @click="form.cashChangeFor = b"
          >
            ${{ b / 100 }}
          </button>
          <button
            type="button"
            role="radio"
            class="pay__chip"
            :class="{ 'pay__chip--on': form.cashChangeFor === 0 }"
            :aria-checked="form.cashChangeFor === 0"
            @click="form.cashChangeFor = 0"
          >
            {{ copy.cash.exact }}
          </button>
        </div>
        <Transition name="fade">
          <p v-if="change > 0" class="pay__change" aria-live="polite">{{ copy.cash.change(formatCents(change)) }}</p>
        </Transition>
      </div>
      <p v-else-if="form.paymentMethod === 'transfer'" key="transfer" class="pay__extra pay__hint">
        <i class="fa-solid fa-circle-info" aria-hidden="true"></i> {{ copy.transferHint }}
      </p>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.pay {
  @include flex(column, stretch, flex-start, 1rem);

  &__list {
    @include flex-cards(220px, 0.75rem);
  }

  &__extra {
    padding: 1rem;
    border-radius: $radius-md;
    background: $sand;
  }

  &__q {
    font-weight: 700;
    margin-bottom: 0.6rem;
  }

  &__chips {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__chip {
    min-width: 64px;
    min-height: 46px;
    padding: 0.4rem 1rem;
    border-radius: $radius-pill;
    border: 2px solid $ink;
    background: $surface;
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.05rem;
    -webkit-tap-highlight-color: transparent;
    transition:
      background-color 0.18s ease,
      transform 0.16s $ease,
      box-shadow 0.18s ease;

    &:active {
      transform: scale(0.94);
    }

    &--on {
      background: $lime;
      box-shadow: 0 3px 0 $ink;
    }
  }

  &__change {
    margin-top: 0.75rem;
    font-family: $font-display;
    font-weight: 600;
    font-size: 1.1rem;
    color: $lime-deep;
  }

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $info;
      margin-right: 0.3rem;
    }
  }
}
</style>
