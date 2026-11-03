<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { myOrders, normalizeCode } from '@/composables/useMyOrders'
import { formatCents, formatDate, formatTime } from '@/utils/format'
import { site } from '@/config/site'
import { checkoutCopy } from '@/config/checkout'

const router = useRouter()
const copy = checkoutCopy.lookup
const raw = ref('')
const invalid = ref(false)
const recent = myOrders()

function go() {
  const code = normalizeCode(raw.value)
  invalid.value = !/^ST-[A-Z0-9]{4,8}$/.test(code)
  if (!invalid.value) router.push(`/pedido/${code}`)
}
</script>

<template>
  <div class="lookup">
    <div class="lookup__inner">
      <img src="/brand/tile-2.webp" alt="" class="lookup__tile" aria-hidden="true" />
      <h1 class="lookup__title">{{ site.tracking.title }}</h1>
      <p class="lookup__lead">{{ site.tracking.lead }}</p>

      <form class="lookup__form" novalidate @submit.prevent="go">
        <label for="lookup-code" class="visually-hidden">{{ copy.label }}</label>
        <input
          id="lookup-code"
          v-model="raw"
          class="lookup__input"
          type="text"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
          enterkeyhint="search"
          maxlength="12"
          :placeholder="copy.placeholder"
          :aria-invalid="invalid"
          aria-describedby="lookup-msg"
          @input="invalid = false"
        />
        <button type="submit" class="btn btn--cta lookup__btn">
          {{ copy.submit }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </button>
      </form>
      <p id="lookup-msg" class="lookup__msg" :class="{ 'lookup__msg--error': invalid }" role="status">
        {{ invalid ? copy.invalid : '' }}
      </p>

      <section class="lookup__recent">
        <h2 class="lookup__h2">{{ copy.recent }}</h2>
        <p v-if="!recent.length" class="lookup__none">{{ copy.none }}</p>
        <ul v-else class="lookup__list">
          <li v-for="o in recent" :key="o.code">
            <RouterLink :to="`/pedido/${o.code}`" class="lookup__item">
              <span class="lookup__code">{{ o.code }}</span>
              <span class="lookup__when">{{ formatDate(o.createdAt) }} · {{ formatTime(o.createdAt) }}</span>
              <span class="lookup__total">{{ formatCents(o.total) }}</span>
              <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
            </RouterLink>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lookup {
  padding: 2rem 0 4rem;
  background: $paper;

  &__inner {
    @include container(620px);
    @include flex(column, stretch, flex-start);
    text-align: center;
  }

  &__tile {
    width: 84px;
    height: auto;
    margin: 0 auto 0.6rem;
    rotate: -8deg;
  }

  &__title {
    @include display($display-md, 700);
  }

  &__lead {
    color: $ink-soft;
    margin: 0.5rem auto 1.4rem;
    max-width: 40ch;
  }

  &__form {
    @include flex(row, stretch, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__input {
    flex: 1 1 220px;
    min-height: 64px;
    font-family: $font-display;
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-align: center;
    text-transform: uppercase;
    border: 2px solid $ink;
    border-radius: $radius-md;

    &::placeholder {
      color: $line;
    }

    &:focus {
      border-color: $ink;
      box-shadow: 0 0 0 4px rgba($lime, 0.5);
    }

    &[aria-invalid='true'] {
      border-color: $danger;
    }
  }

  &__btn {
    flex: 1 1 140px;
    min-height: 64px;
    font-size: 1.1rem;
  }

  &__msg {
    min-height: 1.6em;
    margin-top: 0.4rem;
    font-size: $text-sm;

    &--error {
      color: $danger;
      font-weight: 600;
    }
  }

  &__recent {
    margin-top: 1.5rem;
    text-align: left;
  }

  &__h2 {
    @include eyebrow;
    color: $ink-soft;
    margin-bottom: 0.7rem;
  }

  &__none {
    color: $ink-muted;
    font-size: $text-sm;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.8rem);
    flex-wrap: wrap;
    min-height: 60px;
    padding: 0.7rem 1rem;
    border-radius: $radius-md;
    background: $surface;
    border: 1px solid $line;
    transition:
      border-color 0.2s ease,
      transform 0.16s $ease;

    &:active {
      transform: scale(0.98);
    }

    @media (hover: hover) {
      &:hover {
        border-color: $ink;
      }
    }
  }

  &__code {
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.15rem;
    letter-spacing: 0.05em;
  }

  &__when {
    flex: 1;
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__total {
    font-weight: 700;
  }
}
</style>
