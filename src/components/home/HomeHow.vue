<script setup lang="ts">
import { ref } from 'vue'
import { gsap, useGsap } from '@/composables/useGsap'
import { site } from '@/config/site'
import { home } from '@/config/home'

// "Cómo pedir" contado como lo que es: una comanda de cocina. Los estados son los mismos
// del seguimiento en vivo, así el cliente ya los reconoce cuando hace su pedido.
const root = ref<HTMLElement | null>(null)
const copy = home.how

useGsap(root, ({ motion }) => {
  if (!motion) return
  const q = gsap.utils.selector(root.value)
  const tl = gsap.timeline({ scrollTrigger: { trigger: q('.how__ticket')[0], start: 'top 75%', once: true } })
  // la comanda "sale de la impresora": se destapa de arriba hacia abajo
  tl.from(q('.how__ticket'), { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power3.out' })
    .from(q('.how__row'), { x: -16, autoAlpha: 0, stagger: 0.18, duration: 0.5, ease: 'power3.out' }, 0.35)
    .from(q('.how__stamp'), { scale: 2.2, autoAlpha: 0, rotation: -24, duration: 0.45, ease: 'power4.out' }, '>-0.05')
})
</script>

<template>
  <section ref="root" class="how" aria-labelledby="how-title">
    <div class="how__copy">
      <h2 id="how-title" class="how__title">{{ copy.title }}</h2>
      <p class="how__lead">{{ copy.lead }}</p>
      <RouterLink to="/menu" class="btn btn--cta how__cta">
        {{ site.hero.ctaPrimary }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>

    <article class="how__ticket" :aria-label="copy.ticketLabel">
      <header class="how__ticket-head">
        <img src="/brand/logo.png" alt="" width="1000" height="351" class="how__logo" loading="lazy" />
        <span class="how__code">{{ copy.code }}</span>
      </header>

      <ol class="how__rows">
        <li v-for="(s, i) in copy.steps" :key="s.title" class="how__row">
          <span class="how__n" aria-hidden="true">{{ i + 1 }}</span>
          <span class="how__body">
            <strong>{{ s.title }}</strong>
            <span>{{ s.text }}</span>
          </span>
          <span class="how__state" :class="`how__state--${s.tone}`">{{ s.state }}</span>
        </li>
      </ol>

      <footer class="how__total">
        <span>{{ copy.totalLabel }}</span>
        <strong>{{ copy.totalValue }}</strong>
      </footer>
      <span class="how__stamp" aria-hidden="true">{{ copy.stamp }}</span>
    </article>
  </section>
</template>

<style scoped lang="scss">
$tooth: 9px;

.how {
  @include container;
  @include flex(column, stretch, flex-start, 2.5rem);
  padding-block: $space-section;

  @include from('lg') {
    flex-direction: row;
    align-items: center;
    gap: 5rem;
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1rem);

    @include from('lg') {
      flex: 1 1 42%;
    }
  }

  &__title {
    @include display($display-lg, 700);
    max-width: 11ch;
  }

  &__lead {
    color: $ink-soft;
    font-size: $text-lg;
    max-width: 34ch;
  }

  &__cta {
    margin-top: 0.5rem;
  }

  // Papel térmico: dientes arriba y abajo hechos con máscara (no geometría inventada)
  &__ticket {
    position: relative;
    background: $surface;
    padding: calc(1.5rem + #{$tooth}) 1.4rem calc(1.4rem + #{$tooth});
    filter: drop-shadow(0 18px 28px rgba($ink, 0.14));
    transform: rotate(-1.5deg);
    -webkit-mask:
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / (2 * $tooth) 51% repeat-x,
      conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / (2 * $tooth) 51% repeat-x;
    mask:
      conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / (2 * $tooth) 51% repeat-x,
      conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) top / (2 * $tooth) 51% repeat-x;
    max-width: 480px;
    width: 100%;
    margin-inline: auto;

    @include from('lg') {
      flex: 1 1 48%;
    }
  }

  &__ticket-head {
    @include flex(row, center, space-between, 1rem);
    padding-bottom: 1rem;
    border-bottom: 2px dashed $line;
  }

  &__logo {
    width: 120px;
    height: auto;
  }

  &__code {
    font-family: $font-display;
    font-weight: 600;
    font-size: $text-sm;
    color: $ink-muted;
    font-variant-numeric: tabular-nums;
  }

  &__rows {
    list-style: none;
    @include flex(column, stretch, flex-start, 0);
  }

  &__row {
    @include flex(row, center, flex-start, 0.9rem);
    padding-block: 1rem;
    border-bottom: 2px dashed $line;
  }

  &__n {
    flex: none;
    @include script(2.6rem);
    color: $coral-deep;
    width: 1.4ch;
    text-align: center;
  }

  &__body {
    flex: 1;
    min-width: 0;
    @include flex(column, flex-start, flex-start, 0.15rem);
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.4;

    strong {
      font-family: $font-display;
      font-size: $text-lg;
      font-weight: 700;
      color: $ink;
    }
  }

  // Mismos colores que la línea de tiempo del seguimiento
  &__state {
    flex: none;
    font-size: $text-xs;
    font-weight: 800;
    padding: 0.3rem 0.6rem;
    border-radius: $radius-pill;

    &--received {
      background: $coral-soft;
      color: $coral-deep;
    }
    &--kitchen {
      background: $warning-bg;
      color: darken($warning, 14%);
    }
    &--road {
      background: $lime-soft;
      color: $lime-deep;
    }
  }

  &__total {
    @include flex(row, baseline, space-between, 1rem);
    padding-top: 1rem;
    font-weight: 700;

    strong {
      font-family: $font-display;
      font-size: $display-sm;
      line-height: 1;
    }
  }

  &__stamp {
    position: absolute;
    left: 30%; // en el hueco entre "Total" y el valor
    bottom: 1.1rem;
    @include script(1.9rem);
    color: $coral-deep;
    border: 3px solid currentColor;
    border-radius: $radius-sm;
    padding: 0.1rem 0.6rem;
    transform: rotate(-12deg);
    opacity: 0.85;
    pointer-events: none;
  }
}
</style>
