<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useMenu } from '@/composables/useMenu'
import { useCheckout } from '@/composables/useCheckout'
import { useToastStore } from '@/stores/toast'
import CheckoutSection from '@/components/checkout/CheckoutSection.vue'
import FulfillmentPicker from '@/components/checkout/FulfillmentPicker.vue'
import CustomerFields from '@/components/checkout/CustomerFields.vue'
import PlaceFields from '@/components/checkout/PlaceFields.vue'
import PaymentPicker from '@/components/checkout/PaymentPicker.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import CheckoutSubmit from '@/components/checkout/CheckoutSubmit.vue'
import PayphoneBox from '@/components/checkout/PayphoneBox.vue'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/checkout'

const cart = useCartStore()
const router = useRouter()
const { settings, error, reload } = useMenu()
const { form, done, payphone, payphoneCode, closePayphone } = useCheckout()
const copy = checkoutCopy.checkout

onMounted(() => {
  if (cart.isEmpty) {
    useToastStore().info(copy.emptyRedirect)
    router.replace('/menu')
  }
})
</script>

<template>
  <div class="co">
    <div class="co__inner">
      <header class="co__head">
        <RouterLink to="/menu" class="co__back">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ copy.back }}
        </RouterLink>
        <h1 class="co__title">{{ site.checkout.title }}</h1>
      </header>

      <div v-if="settings && !settings.storeOpen" class="co__closed" role="status">
        <i class="fa-solid fa-moon" aria-hidden="true"></i>
        <div>
          <strong>{{ copy.closedTitle }}</strong>
          <p>{{ settings.closedMessage }}</p>
          <p v-if="settings.openingHours" class="co__hours">{{ settings.openingHours }}</p>
        </div>
      </div>

      <div class="co__layout">
        <aside class="co__aside">
          <OrderSummary />
          <CheckoutSubmit v-if="settings" />
        </aside>

        <div v-if="!settings" class="co__main" aria-busy="true">
          <p v-if="error" class="co__error">
            {{ error }} <button type="button" class="btn btn--dark btn--sm" @click="reload">Reintentar</button>
          </p>
          <div v-for="n in 4" :key="n" class="co__skel">
            <span class="skeleton" style="width: 45%; height: 26px"></span>
            <span class="skeleton" style="height: 72px"></span>
          </div>
        </div>

        <div v-else class="co__main">
          <CheckoutSection id="paso-fulfillment" :n="1" :title="copy.sections.fulfillment" :done="done.fulfillment">
            <FulfillmentPicker />
          </CheckoutSection>
          <CheckoutSection id="paso-customer" :n="2" :title="copy.sections.customer" :done="done.customer">
            <CustomerFields />
          </CheckoutSection>
          <CheckoutSection
            v-if="form.fulfillment"
            id="paso-place"
            :n="3"
            :title="form.fulfillment === 'pickup' ? copy.sections.branch : copy.sections.address"
            :done="done.place"
          >
            <PlaceFields />
          </CheckoutSection>
          <CheckoutSection id="paso-payment" :n="form.fulfillment ? 4 : 3" :title="copy.sections.payment" :done="done.payment">
            <PaymentPicker />
          </CheckoutSection>
          <CheckoutSection id="paso-notes" :n="form.fulfillment ? 5 : 4" :title="copy.sections.notes" optional>
            <textarea
              v-model="form.notes"
              class="co__notes"
              rows="3"
              maxlength="300"
              :aria-label="copy.sections.notes"
              :placeholder="copy.fields.notesPlaceholder"
            ></textarea>
          </CheckoutSection>
        </div>
      </div>
    </div>

    <PayphoneBox
      v-if="payphone"
      :config="payphone"
      :code="payphoneCode"
      :buyer="{ email: form.email, phone: form.phone }"
      @close="closePayphone"
    />
  </div>
</template>

<style scoped lang="scss">
.co {
  background: $paper;
  padding: 1.25rem 0 calc(150px + env(safe-area-inset-bottom)); // aire para la barra fija del móvil

  @include from('lg') {
    padding: 2.5rem 0 4rem;
  }

  &__inner {
    @include container(1120px);
  }

  &__head {
    margin-bottom: 1.25rem;
  }

  &__back {
    @include flex(row, center, flex-start, 0.4rem);
    min-height: 44px;
    font-size: $text-sm;
    font-weight: 700;
    color: $ink-soft;
  }

  &__title {
    @include display($display-sm, 700);
  }

  &__closed {
    @include flex(row, flex-start, flex-start, 0.9rem);
    padding: 1rem 1.1rem;
    margin-bottom: 1.25rem;
    border-radius: $radius-md;
    background: $ink;
    color: $surface;

    i {
      font-size: 1.4rem;
      color: $lime;
      margin-top: 0.2rem;
    }

    p {
      font-size: $text-sm;
      opacity: 0.85;
    }
  }

  &__hours {
    margin-top: 0.25rem;
  }

  &__layout {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row-reverse;
      align-items: flex-start;
      gap: 2rem;
    }
  }

  &__aside {
    @include from('lg') {
      flex: 0 0 380px;
      position: sticky;
      top: calc(var(--header-h) + 1.5rem);
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__skel {
    @include flex(column, stretch, flex-start, 0.9rem);
    padding: 1.25rem;
    border-radius: $radius-md;
    border: 1px solid $line;
    background: $surface;
  }

  &__error {
    color: $danger;
    font-weight: 600;
  }

  &__notes {
    font-size: 1rem;
    border-width: 2px;
    border-radius: 14px;
    resize: vertical;
  }
}
</style>
