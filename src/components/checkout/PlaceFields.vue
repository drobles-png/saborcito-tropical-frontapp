<script setup lang="ts">
import { ref } from 'vue'
import { useMenu } from '@/composables/useMenu'
import { useCheckout } from '@/composables/useCheckout'
import CheckoutField from './CheckoutField.vue'
import ChoiceCard from './ChoiceCard.vue'
import { checkoutCopy } from '@/config/checkout'

const { settings } = useMenu()
const { form, touched, errorOf } = useCheckout()
const copy = checkoutCopy.checkout
const geo = ref<'idle' | 'locating' | 'done' | 'error' | 'unsupported'>(form.lat ? 'done' : 'idle')

function locate() {
  if (!('geolocation' in navigator)) return (geo.value = 'unsupported')
  geo.value = 'locating'
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      form.lat = Number(coords.latitude.toFixed(6))
      form.lng = Number(coords.longitude.toFixed(6))
      geo.value = 'done'
    },
    () => (geo.value = 'error'),
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
  )
}
</script>

<template>
  <div v-if="form.fulfillment === 'delivery'" class="place">
    <CheckoutField id="co-street" :label="copy.fields.street" :error="errorOf('street')">
      <input
        id="co-street"
        v-model="form.street"
        type="text"
        autocomplete="street-address"
        enterkeyhint="next"
        :placeholder="copy.fields.streetPlaceholder"
        :aria-invalid="!!errorOf('street')"
        aria-describedby="co-street-msg"
        @blur="touched.street = true"
      />
    </CheckoutField>
    <CheckoutField id="co-ref" :label="copy.fields.reference" :optional="copy.optional">
      <input id="co-ref" v-model="form.reference" type="text" enterkeyhint="next" :placeholder="copy.fields.referencePlaceholder" />
    </CheckoutField>

    <button
      type="button"
      class="place__geo"
      :class="`place__geo--${geo}`"
      :disabled="geo === 'locating'"
      aria-live="polite"
      @click="locate"
    >
      <i :class="geo === 'done' ? 'fa-solid fa-circle-check' : 'fa-solid fa-location-crosshairs'" aria-hidden="true"></i>
      <span>{{ geo === 'done' ? copy.geo.done : geo === 'locating' ? copy.geo.locating : copy.geo.idle }}</span>
    </button>
    <p v-if="geo === 'error' || geo === 'unsupported'" class="place__note" role="alert">{{ copy.geo[geo] }}</p>

    <p v-if="settings?.deliveryZones" class="place__zones">
      <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
      <span><strong>{{ copy.zones }}:</strong> {{ settings.deliveryZones }}</span>
    </p>
  </div>

  <div v-else-if="form.fulfillment === 'pickup'" class="place" role="radiogroup" :aria-label="copy.sections.branch">
    <div v-for="b in settings?.branches ?? []" :key="b.name" class="place__branch">
      <ChoiceCard
        :selected="form.branch === b.name"
        icon="fa-solid fa-store"
        :label="b.name"
        :text="b.address"
        @select="form.branch = b.name"
      />
      <a v-if="b.mapsUrl" :href="b.mapsUrl" target="_blank" rel="noopener" class="place__maps">
        <i class="fa-solid fa-diamond-turn-right" aria-hidden="true"></i> {{ copy.maps }}
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.place {
  @include flex(column, stretch, flex-start, 1rem);

  &__geo {
    align-self: flex-start;
    @include flex(row, center, flex-start, 0.55rem);
    min-height: 46px;
    padding: 0.6rem 1.1rem;
    border-radius: $radius-pill;
    border: 2px solid $ink;
    font-family: $font-display;
    font-weight: 600;
    transition:
      background-color 0.25s ease,
      border-color 0.25s ease,
      transform 0.16s $ease;

    &:active {
      transform: scale(0.97);
    }

    // buscando: el icono late, sin spinner
    &--locating i {
      animation: geo-pulse 0.9s ease-in-out infinite alternate;
    }

    &--locating:disabled {
      opacity: 1;
    }

    &--done {
      background: $lime;
      border-color: $lime;
    }
  }

  &__note {
    font-size: $text-sm;
    color: $danger;
    margin-top: -0.5rem;
  }

  &__zones {
    @include flex(row, flex-start, flex-start, 0.6rem);
    padding: 0.8rem 0.9rem;
    border-radius: $radius-sm;
    background: $sand;
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.45;

    i {
      margin-top: 0.2rem;
      color: $coral-deep;
    }
  }

  &__branch {
    @include flex(column, stretch, flex-start, 0.35rem);
  }

  &__maps {
    align-self: flex-end;
    padding: 0.3rem 0.4rem;
    font-size: $text-xs;
    font-weight: 700;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

@keyframes geo-pulse {
  from {
    transform: scale(0.85);
    opacity: 0.5;
  }
  to {
    transform: scale(1.15);
    opacity: 1;
  }
}
</style>
