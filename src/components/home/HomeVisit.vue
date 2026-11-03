<script setup lang="ts">
import { ref } from 'vue'
import SectionHead from './SectionHead.vue'
import { revealBatch, useGsap } from '@/composables/useGsap'
import { useMenu } from '@/composables/useMenu'
import { site, whatsappLink } from '@/config/site'
import { home } from '@/config/home'

const { settings, loading } = useMenu()
const root = ref<HTMLElement | null>(null)
const copy = site.sections.visit

useGsap(
  root,
  ({ motion }) => motion && revealBatch('.visit__card', 0.1),
  () => !loading.value,
)
</script>

<template>
  <section ref="root" class="visit">
    <SectionHead :eyebrow="copy.eyebrow" :title="copy.title" />
    <div class="visit__cards">
      <template v-if="loading">
        <div v-for="n in 3" :key="n" class="visit__card visit__card--sk skeleton" aria-hidden="true"></div>
      </template>
      <template v-else-if="settings">
        <article class="visit__card visit__card--hours">
          <i class="fa-regular fa-clock visit__icon" aria-hidden="true"></i>
          <h3 class="visit__h">{{ home.visit.hours }}</h3>
          <p class="visit__state" :class="{ 'visit__state--open': settings.storeOpen }">
            {{ settings.storeOpen ? home.visit.open : home.visit.closed }}
          </p>
          <p class="visit__pre">{{ settings.openingHours }}</p>
        </article>

        <article v-for="b in settings.branches" :key="b.name" class="visit__card">
          <i class="fa-solid fa-location-dot visit__icon" aria-hidden="true"></i>
          <h3 class="visit__h">{{ b.name }}</h3>
          <p>{{ b.address }}</p>
          <a v-if="b.mapsUrl" :href="b.mapsUrl" target="_blank" rel="noopener" class="btn btn--ghost btn--sm visit__btn">
            {{ home.visit.map }} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </a>
        </article>

        <article v-if="settings.whatsapp" class="visit__card visit__card--wa">
          <i class="fa-brands fa-whatsapp visit__icon" aria-hidden="true"></i>
          <h3 class="visit__h">{{ home.visit.whatsapp }}</h3>
          <p>{{ home.visit.whatsappText }}</p>
          <a :href="whatsappLink(settings.whatsapp)" target="_blank" rel="noopener" class="btn btn--dark btn--sm visit__btn">
            WhatsApp
          </a>
        </article>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.visit {
  @include container;
  padding-block: $space-section;

  &__cards {
    @include flex-cards(240px, 1rem);
  }

  &__card {
    @include flex(column, flex-start, flex-start, 0.4rem);
    padding: 1.5rem;
    border-radius: $radius-lg;
    background: $surface;
    border: 2px solid $ink;
    box-shadow: 0 6px 0 $ink;

    &--sk {
      min-height: 200px;
      border: 0;
      box-shadow: none;
    }

    &--hours {
      background: $lime;
    }

    &--wa {
      background: #dff6e7;
    }
  }

  &__icon {
    font-size: 1.6rem;
    margin-bottom: 0.25rem;
  }

  &__h {
    @include display($text-xl, 700);
  }

  &__state {
    @include flex(row, center, flex-start, 0.4rem);
    font-weight: 800;
    font-size: $text-sm;

    &::before {
      content: '';
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: $gray;
    }

    &--open::before {
      background: $success;
    }
  }

  &__pre {
    white-space: pre-line;
  }

  &__btn {
    margin-top: auto;
  }
}
</style>
