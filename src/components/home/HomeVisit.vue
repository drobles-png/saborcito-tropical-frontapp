<script setup lang="ts">
import { useMenu } from '@/composables/useMenu'
import { whatsappLink } from '@/config/site'
import { home } from '@/config/home'

// Un letrero de local, no tres tarjetas: a la izquierda si está abierto (lo primero que uno
// pregunta), a la derecha a dónde ir o a quién escribir. Sin entrada animada: el momento
// de esta zona es la comanda de arriba, y aquí la información tiene que estar siempre visible.
const { settings, loading } = useMenu()
const copy = home.visit
</script>

<template>
  <section class="visit" aria-labelledby="visit-title">
    <div class="visit__sign">
      <h2 id="visit-title" class="visit__title">{{ copy.title }}</h2>
      <template v-if="loading">
        <span class="visit__state visit__state--sk skeleton" aria-hidden="true"></span>
        <span class="visit__hours visit__hours--sk skeleton" aria-hidden="true"></span>
      </template>
      <template v-else-if="settings">
        <p class="visit__state" :class="{ 'visit__state--open': settings.storeOpen }">
          <span class="visit__dot" aria-hidden="true"></span>
          {{ settings.storeOpen ? copy.open : copy.closed }}
        </p>
        <p class="visit__hours">{{ settings.openingHours }}</p>
      </template>
    </div>

    <ul class="visit__list">
      <template v-if="loading">
        <li v-for="n in 2" :key="n" class="visit__row visit__row--sk skeleton" aria-hidden="true"></li>
      </template>
      <template v-else-if="settings">
        <li v-for="b in settings.branches" :key="b.name" class="visit__row">
          <a :href="b.mapsUrl || undefined" target="_blank" rel="noopener" class="visit__link">
            <i class="fa-solid fa-location-dot visit__icon" aria-hidden="true"></i>
            <span class="visit__what">
              <strong>{{ b.name }}</strong>
              <span>{{ b.address }}</span>
            </span>
            <span class="visit__go">{{ copy.map }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
          </a>
        </li>
        <li v-if="settings.whatsapp" class="visit__row">
          <a :href="whatsappLink(settings.whatsapp)" target="_blank" rel="noopener" class="visit__link visit__link--wa">
            <i class="fa-brands fa-whatsapp visit__icon" aria-hidden="true"></i>
            <span class="visit__what">
              <strong>{{ copy.whatsapp }}</strong>
              <span>{{ copy.whatsappText }}</span>
            </span>
            <span class="visit__go">{{ copy.write }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
          </a>
        </li>
      </template>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.visit {
  @include container;
  @include flex(column, stretch, flex-start, 2rem);
  padding-block: $space-section;

  @include from('lg') {
    flex-direction: row;
    align-items: flex-end;
    gap: 4rem;
  }

  &__sign {
    @include flex(column, flex-start, flex-start, 0.75rem);

    @include from('lg') {
      flex: 1 1 45%;
    }
  }

  &__title {
    @include display($display-lg, 700);
  }

  &__state {
    @include flex(row, center, flex-start, 0.75rem);
    @include display($display-md, 700);
    color: $ink-muted;

    &--open {
      color: $lime-deep;
    }

    &--sk {
      width: 14ch;
      height: 3rem;
    }
  }

  &__dot {
    flex: none;
    width: 0.5em;
    height: 0.5em;
    border-radius: 50%;
    background: currentColor;
  }

  &__state--open &__dot {
    animation: visit-pulse 1.8s ease-out infinite;
  }

  &__hours {
    font-size: $text-lg;
    color: $ink-soft;
    white-space: pre-line;

    &--sk {
      width: 22ch;
      height: 1.4rem;
    }
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0);
    border-top: 3px solid $ink;

    @include from('lg') {
      flex: 1 1 55%;
    }
  }

  &__row {
    border-bottom: 3px solid $ink;

    &--sk {
      height: 88px;
      border-radius: 0;
    }
  }

  &__link {
    @include flex(row, center, flex-start, 1rem);
    min-height: 88px;
    padding: 1rem 0.25rem;
    transition: background-color 0.25s ease;

    @media (hover: hover) {
      &:hover {
        background: $lime-soft;
      }

      &:hover .visit__go i {
        transform: translateX(4px);
      }
    }

    &--wa .visit__icon {
      color: $success;
    }
  }

  &__icon {
    flex: none;
    width: 1.6em;
    text-align: center;
    font-size: 1.5rem;
    color: $coral-deep;
  }

  &__what {
    flex: 1;
    min-width: 0;
    @include flex(column, flex-start, flex-start, 0.15rem);
    color: $ink-soft;
    font-size: $text-sm;

    strong {
      font-family: $font-display;
      font-size: $text-xl;
      line-height: 1.15;
      color: $ink;
    }
  }

  &__go {
    flex: none;
    @include flex(row, center, flex-start, 0.4rem);
    font-family: $font-display;
    font-weight: 600;

    i {
      transition: transform 0.25s $ease;
    }
  }
}

@keyframes visit-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba($lime-deep, 0.5);
  }
  100% {
    box-shadow: 0 0 0 0.3em rgba($lime-deep, 0);
  }
}

@include reduced-motion {
  .visit__state--open .visit__dot {
    animation: none;
  }
}
</style>
