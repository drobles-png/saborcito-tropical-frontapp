<script setup lang="ts">
import { computed } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { home } from '@/config/home'
import { useMenu } from '@/composables/useMenu'

const { settings } = useMenu()
const year = new Date().getFullYear()
const tiles = Array.from({ length: 10 }, (_, i) => `/brand/tile-${i + 1}.webp`)
const whatsapp = computed(() => settings.value?.whatsapp || site.whatsapp)
const socials = computed(() =>
  (Object.entries(site.social) as Array<[string, string]>).filter(([, url]) => url),
)
</script>

<template>
  <footer class="footer">
    <div class="footer__band" aria-hidden="true">
      <div class="footer__band-track">
        <img v-for="(t, i) in [...tiles, ...tiles]" :key="i" :src="t" alt="" width="190" height="220" loading="lazy" />
      </div>
    </div>

    <div class="footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" class="footer__sticker" :aria-label="`${site.name}, inicio`">
          <img src="/brand/logo.png" :alt="site.name" width="1000" height="351" loading="lazy" />
        </RouterLink>
        <p class="footer__tagline">{{ site.tagline }}</p>
        <div v-if="socials.length" class="footer__social">
          <a v-for="[name, url] in socials" :key="name" :href="url" target="_blank" rel="noopener" :aria-label="name">
            <i :class="`fa-brands fa-${name}`" aria-hidden="true"></i>
          </a>
        </div>
      </div>

      <div class="footer__col">
        <h2 class="footer__heading">{{ home.footer.links }}</h2>
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
      </div>

      <div v-if="settings?.openingHours" class="footer__col">
        <h2 class="footer__heading">{{ home.footer.hours }}</h2>
        <p class="footer__pre">{{ settings.openingHours }}</p>
      </div>

      <div v-if="settings?.branches.length" class="footer__col">
        <h2 class="footer__heading">{{ home.footer.branches }}</h2>
        <a
          v-for="b in settings.branches"
          :key="b.name"
          :href="b.mapsUrl || undefined"
          target="_blank"
          rel="noopener"
          class="footer__branch"
        >
          <strong>{{ b.name }}</strong>
          <span>{{ b.address }}</span>
        </a>
      </div>

      <div class="footer__col">
        <h2 class="footer__heading">{{ home.footer.contact }}</h2>
        <a v-if="whatsapp" :href="whatsappLink(whatsapp)" target="_blank" rel="noopener" class="footer__wa">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp
        </a>
        <a :href="`mailto:${site.email}`">{{ site.email }}</a>
      </div>
    </div>

    <div class="footer__bar">
      <span>© {{ year }} {{ site.name }}. {{ site.footer.legal }}</span>
      <a href="https://bakano.ec" target="_blank" rel="noopener" class="footer__credit">{{ site.footer.madeBy }}</a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: $ink;
  color: rgba($surface, 0.8);
  margin-top: auto;
  // espacio para la CartBar fija en móvil
  padding-bottom: calc(env(safe-area-inset-bottom) + 72px);

  @include from('md') {
    padding-bottom: 0;
  }

  &__band {
    background: $lime;
    overflow: hidden;
    padding-block: 0.6rem;
  }

  &__band-track {
    @include flex(row, center, flex-start, 0.6rem);
    width: max-content;
    animation: band 40s linear infinite;

    img {
      height: 54px;
      width: auto;
    }
  }

  &__inner {
    @include container;
    @include flex-cards(180px, 2rem 2.5rem);
    padding-block: $space-xl 2.5rem;
  }

  &__brand {
    flex: 2 1 260px !important;
    @include flex(column, flex-start, flex-start, 1rem);
  }

  &__sticker {
    display: inline-block;
    background: $surface;
    padding: 0.9rem 1.2rem;
    border-radius: $radius-md;
    transform: rotate(-3deg);
    box-shadow: 0 6px 0 $lime;
    transition: transform 0.3s $ease;

    &:hover {
      transform: rotate(0deg) scale(1.03);
    }

    img {
      height: 52px;
      width: auto;
    }
  }

  &__tagline {
    font-family: $font-script;
    font-size: $display-sm;
    color: $lime;
    line-height: 1;
  }

  &__social {
    @include flex(row, center, flex-start, 0.5rem);

    a {
      @include flex(row, center, center);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba($surface, 0.08);
      color: $surface;

      &:hover {
        background: $coral-deep;
      }
    }
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.5rem);
    font-size: $text-sm;

    a {
      color: rgba($surface, 0.8);
      transition: color 0.2s ease;
      min-height: 28px;

      &:hover {
        color: $lime;
      }
    }
  }

  &__heading {
    font-family: $font-principal;
    font-size: $text-xs;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $lime;
    margin-bottom: 0.3rem;
  }

  &__pre {
    white-space: pre-line;
  }

  &__branch {
    @include flex(column, flex-start, flex-start);
    line-height: 1.4;

    strong {
      color: $surface;
    }
  }

  &__wa {
    @include flex(row, center, flex-start, 0.4rem);
    font-weight: 700;
  }

  &__bar {
    @include container;
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
    padding-block: 1.2rem;
    border-top: 1px solid rgba($surface, 0.1);
    font-size: $text-xs;
    color: rgba($surface, 0.6);
  }

  &__credit {
    font-weight: 700;
    color: $surface;
    min-height: 44px;
    @include flex(row, center, flex-start);

    &:hover {
      color: $lime;
    }
  }
}

@keyframes band {
  to {
    transform: translateX(-50%);
  }
}
</style>
