<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { Category } from '@/types'

const props = defineProps<{ categories: Category[]; active: string }>()
const emit = defineEmits<{ select: [slug: string] }>()

const track = ref<HTMLElement | null>(null)
const indicator = ref({ x: 0, w: 0 })

// El indicador lima se desliza bajo el chip activo y el carril lo mantiene a la vista.
async function sync() {
  await nextTick()
  const el = track.value?.querySelector<HTMLElement>(`[data-slug="${props.active}"]`)
  if (!el || !track.value) return
  indicator.value = { x: el.offsetLeft, w: el.offsetWidth }
  const target = el.offsetLeft - track.value.clientWidth / 2 + el.offsetWidth / 2
  track.value.scrollTo({ left: target, behavior: 'smooth' })
}

watch(() => [props.active, props.categories.length], sync, { immediate: true })
</script>

<template>
  <nav class="cbar" aria-label="Categorías del menú">
    <div ref="track" class="cbar__track">
      <span
        class="cbar__indicator"
        aria-hidden="true"
        :style="{ transform: `translateX(${indicator.x}px)`, width: `${indicator.w}px` }"
      ></span>
      <a
        v-for="c in categories"
        :key="c.id"
        :href="`#cat-${c.slug}`"
        :data-slug="c.slug"
        class="cbar__chip"
        :class="{ 'cbar__chip--on': active === c.slug }"
        :aria-current="active === c.slug ? 'true' : undefined"
        @click.prevent="emit('select', c.slug)"
      >
        <i v-if="c.icon" :class="c.icon" aria-hidden="true"></i>
        {{ c.name }}
      </a>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.cbar {
  position: sticky;
  top: var(--header-visible, var(--header-h));
  z-index: 50;
  background: rgba($paper, 0.94);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $line;
  transition: top 0.35s $ease;
  margin-inline: -1.25rem;

  @include from('md') {
    margin-inline: -2rem;
  }

  &__track {
    position: relative;
    @include flex(row, center, flex-start, 0.35rem);
    overflow-x: auto;
    scrollbar-width: none;
    padding: 0.6rem 1.25rem;
    overscroll-behavior-x: contain;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('md') {
      padding-inline: 2rem;
    }
  }

  &__indicator {
    position: absolute;
    left: 0;
    top: 0.6rem;
    height: 44px;
    border-radius: $radius-pill;
    background: $lime;
    box-shadow: 0 3px 0 $ink;
    transition:
      transform 0.45s $ease,
      width 0.45s $ease;
  }

  &__chip {
    position: relative;
    z-index: 1;
    @include flex(row, center, center, 0.45rem);
    flex-shrink: 0;
    min-height: 44px;
    padding: 0 1rem;
    border-radius: $radius-pill;
    font-family: $font-display;
    font-weight: 600;
    font-size: 0.95rem;
    white-space: nowrap;
    color: $ink-soft;
    transition: color 0.25s ease;
    -webkit-tap-highlight-color: transparent;
    @include focus-ring($coral-deep);

    i {
      font-size: 0.85em;
    }

    &--on {
      color: $ink;
    }
  }
}
</style>
