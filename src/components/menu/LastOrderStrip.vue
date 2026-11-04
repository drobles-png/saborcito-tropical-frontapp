<script setup lang="ts">
import { computed } from 'vue'
import { useLastOrder } from '@/composables/useLastOrder'
import { useMenu } from '@/composables/useMenu'
import { site } from '@/config/site'
import { formatCents, imageUrl } from '@/utils/format'

// Franja para quien ya pidió desde este celular: sigue su pedido en curso o repite "lo de siempre".
const { last, active, reorder } = useLastOrder()
const { menu } = useMenu()
const steps = site.tracking.steps as Record<string, { label: string }>

const summary = computed(() => {
  const items = last.value?.items ?? []
  const names = items.slice(0, 2).map((i) => (i.qty > 1 ? `${i.qty}× ${i.name}` : i.name))
  return names.join(' + ') + (items.length > 2 ? ` y ${items.length - 2} más` : '')
})
</script>

<template>
  <Transition name="strip">
    <RouterLink v-if="active" :to="`/pedido/${active.code}`" class="strip strip--live">
      <span class="strip__pulse" aria-hidden="true"></span>
      <span class="strip__text">
        Tu pedido <strong>{{ active.code }}</strong> · {{ steps[active.status]?.label ?? active.status }}
      </span>
      <span class="strip__go">Ver <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
    </RouterLink>

    <div v-else-if="last && menu" class="strip">
      <span class="strip__thumbs" aria-hidden="true">
        <img v-for="(i, n) in last.items.slice(0, 3)" :key="n" :src="imageUrl(i.image, 'sm')" alt="" width="40" height="40" />
      </span>
      <span class="strip__text">
        <small>¿Lo de siempre?</small>
        <strong>{{ summary }}</strong>
      </span>
      <button type="button" class="btn btn--lime btn--sm strip__btn" @click="reorder()">
        Repetir · {{ formatCents(last.subtotal) }}
      </button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.strip {
  @include container(1160px);
  @include flex(row, center, flex-start, 0.75rem);
  background: $ink;
  color: $surface;
  border-radius: $radius-md;
  padding: 0.6rem 0.6rem 0.6rem 0.9rem;
  margin-block: 0.9rem 0;
  max-width: calc(100% - 2.5rem);

  @include from('md') {
    max-width: 1096px;
  }

  &--live {
    background: $lime;
    color: $ink;
    min-height: 52px;
  }

  &__pulse {
    flex: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: $coral-deep;
    box-shadow: 0 0 0 0 rgba($coral-deep, 0.6);
    animation: strip-pulse 1.6s ease-out infinite;
  }

  &__thumbs {
    flex: none;
    @include flex(row, center, flex-start);

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: $surface;
      object-fit: contain;
      border: 2px solid $ink;

      & + img {
        margin-left: -14px;
      }
    }
  }

  &__text {
    flex: 1;
    min-width: 0;
    @include flex(column, flex-start, center);
    font-size: $text-sm;
    line-height: 1.3;

    small {
      color: $lime;
      font-weight: 700;
      font-size: $text-xs;
    }

    strong {
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }
  }

  &--live &__text {
    display: block;
  }

  &__go {
    flex: none;
    font-family: $font-display;
    font-weight: 600;
    padding-right: 0.4rem;
  }

  &__btn {
    flex: none;
    min-height: 44px;
  }
}

@keyframes strip-pulse {
  to {
    box-shadow: 0 0 0 12px rgba($coral-deep, 0);
  }
}

.strip-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.45s $ease;
}
.strip-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

@include reduced-motion {
  .strip__pulse {
    animation: none;
  }
}
</style>
