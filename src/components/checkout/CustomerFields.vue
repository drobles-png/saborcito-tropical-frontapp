<script setup lang="ts">
import { cleanPhone, maskPhone, useCheckout } from '@/composables/useCheckout'
import CheckoutField from './CheckoutField.vue'
import { checkoutCopy } from '@/config/checkout'

const { form, touched, errorOf, usedSaved, forget } = useCheckout()
const copy = checkoutCopy.checkout

function onPhone(e: Event) {
  const input = e.target as HTMLInputElement
  form.phone = cleanPhone(input.value)
  input.value = maskPhone(form.phone) // la máscara se reaplica aunque el valor limpio no cambie
}
</script>

<template>
  <div class="customer">
    <Transition name="rise">
      <p v-if="usedSaved" class="customer__saved">
        <i class="fa-solid fa-user-check" aria-hidden="true"></i>
        {{ copy.savedData }}
        <button type="button" class="customer__forget" @click="forget">{{ copy.forgetData }}</button>
      </p>
    </Transition>

    <div class="customer__row">
      <CheckoutField id="co-name" :label="copy.fields.name" :error="errorOf('name')">
        <input
          id="co-name"
          v-model="form.name"
          type="text"
          autocomplete="name"
          autocapitalize="words"
          enterkeyhint="next"
          :placeholder="copy.fields.namePlaceholder"
          :aria-invalid="!!errorOf('name')"
          aria-describedby="co-name-msg"
          @blur="touched.name = true"
        />
      </CheckoutField>
      <CheckoutField id="co-phone" :label="copy.fields.phone" :error="errorOf('phone')">
        <input
          id="co-phone"
          :value="maskPhone(form.phone)"
          type="tel"
          inputmode="tel"
          autocomplete="tel-national"
          enterkeyhint="next"
          maxlength="16"
          :placeholder="copy.fields.phonePlaceholder"
          :aria-invalid="!!errorOf('phone')"
          aria-describedby="co-phone-msg"
          @input="onPhone"
          @blur="touched.phone = true"
        />
      </CheckoutField>
    </div>
    <CheckoutField
      id="co-email"
      :label="copy.fields.email"
      :optional="copy.optional"
      :hint="copy.fields.emailHint"
      :error="errorOf('email')"
    >
      <input
        id="co-email"
        v-model.trim="form.email"
        type="email"
        inputmode="email"
        autocomplete="email"
        autocapitalize="off"
        spellcheck="false"
        placeholder="tu@correo.com"
        :aria-invalid="!!errorOf('email')"
        aria-describedby="co-email-msg"
        @blur="touched.email = true"
      />
    </CheckoutField>
  </div>
</template>

<style scoped lang="scss">
.customer {
  @include flex(column, stretch, flex-start, 1rem);

  &__row {
    @include flex-cards(220px, 1rem);
  }

  &__saved {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    padding: 0.6rem 0.85rem;
    border-radius: $radius-sm;
    background: $lime-soft;
    font-size: $text-sm;
    font-weight: 600;

    i {
      color: $lime-deep;
    }
  }

  &__forget {
    margin-left: auto;
    min-height: 32px;
    font-size: $text-xs;
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
    color: $ink-soft;
  }
}
</style>
