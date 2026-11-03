<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useOrderAlerts } from '@/composables/admin/useOrderAlerts'
import { admin } from '@/config/admin'

const router = useRouter()
const userStore = useUserStore()
const { activeCount, soundEnabled, start, stop, toggleSound } = useOrderAlerts()

onMounted(start)
onUnmounted(stop)

function logout() {
  stop()
  userStore.clear()
  router.replace({ name: 'AdminLogin' })
}
</script>

<template>
  <div class="admin">
    <aside class="admin__side">
      <RouterLink :to="{ name: 'AdminDashboard' }" class="admin__logo" aria-label="Resumen">
        <img src="/brand/logo.png" alt="saborcito TROPICAL" width="150" height="60" />
      </RouterLink>
      <nav class="admin__nav" aria-label="Panel">
        <RouterLink v-for="item in admin.nav" :key="item.label" :to="item.to" class="admin__link">
          <i :class="item.icon" aria-hidden="true"></i>
          <span>{{ item.label }}</span>
          <Transition name="fade">
            <span v-if="item.badge && activeCount" class="admin__badge">{{ activeCount }}</span>
          </Transition>
        </RouterLink>
      </nav>
      <div class="admin__foot">
        <button class="admin__link" :class="{ 'admin__link--on': soundEnabled }" @click="toggleSound">
          <i :class="soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'" aria-hidden="true"></i>
          <span>{{ soundEnabled ? admin.soundOn : admin.soundOff }}</span>
        </button>
        <a href="/" target="_blank" rel="noopener" class="admin__link">
          <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          <span>{{ admin.viewStore }}</span>
        </a>
        <button class="admin__link" @click="logout">
          <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
          <span>{{ admin.logout }}</span>
        </button>
      </div>
    </aside>

    <header class="admin__top">
      <img src="/brand/logo.png" alt="saborcito TROPICAL" width="110" height="44" />
      <div class="admin__top-actions">
        <button
          class="admin__icon-btn"
          :class="{ 'admin__icon-btn--on': soundEnabled }"
          :aria-label="soundEnabled ? admin.soundOn : admin.soundOff"
          @click="toggleSound"
        >
          <i :class="soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'"></i>
        </button>
        <a href="/" target="_blank" rel="noopener" class="admin__icon-btn" :aria-label="admin.viewStore">
          <i class="fa-solid fa-store"></i>
        </a>
        <button class="admin__icon-btn" :aria-label="admin.logout" @click="logout">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </header>

    <main class="admin__main">
      <RouterView v-slot="{ Component, route }">
        <Transition name="admin-page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <nav class="admin__tabs" aria-label="Panel">
      <RouterLink v-for="item in admin.nav" :key="item.label" :to="item.to" class="admin__tab">
        <span class="admin__tab-icon">
          <i :class="item.icon" aria-hidden="true"></i>
          <span v-if="item.badge && activeCount" class="admin__badge admin__badge--dot">{{ activeCount }}</span>
        </span>
        <span>{{ item.short }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped lang="scss">
$side-w: 248px;

.admin {
  min-height: 100dvh;
  background: $paper;

  &__side {
    display: none;

    @include from('lg') {
      @include flex(column, stretch, flex-start, 1.5rem);
      position: fixed;
      inset: 0 auto 0 0;
      width: $side-w;
      background: $ink;
      color: rgba($surface, 0.72);
      padding: 1.25rem 0.9rem;
      z-index: 50;
    }
  }

  // Sobre fondo oscuro el logo va dentro de una pegatina blanca
  &__logo {
    background: $surface;
    border-radius: $radius-md;
    padding: 0.7rem 1rem;
    @include flex(row, center, center);
    box-shadow: 0 4px 0 rgba($lime, 0.9);
    transform: rotate(-1.5deg);

    img {
      height: 52px;
      width: auto;
    }
  }

  &__nav {
    @include flex(column, stretch, flex-start, 0.25rem);
    flex: 1;
  }

  &__foot {
    @include flex(column, stretch, flex-start, 0.25rem);
    border-top: 1px solid rgba($surface, 0.1);
    padding-top: 0.75rem;
  }

  &__link {
    @include flex(row, center, flex-start, 0.8rem);
    min-height: 46px;
    padding: 0 0.9rem;
    border-radius: $radius-sm;
    font-family: $font-display;
    font-weight: 500;
    font-size: 1rem;
    text-align: left;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    i {
      width: 1.2rem;
      text-align: center;
    }

    &:hover {
      background: rgba($surface, 0.06);
      color: $surface;
    }

    &.router-link-exact-active,
    &.router-link-active:not([href='/admin']) {
      background: $lime;
      color: $ink;
    }

    &--on i {
      color: $lime;
    }
  }

  &__badge {
    margin-left: auto;
    min-width: 1.6rem;
    height: 1.6rem;
    padding: 0 0.45rem;
    border-radius: $radius-pill;
    background: $coral;
    color: $surface;
    font-size: 0.8rem;
    font-weight: 700;
    @include flex(row, center, center);

    &--dot {
      position: absolute;
      top: -0.45rem;
      right: -0.9rem;
      min-width: 1.25rem;
      height: 1.25rem;
      font-size: 0.68rem;
      font-family: $font-display;
    }
  }

  &__top {
    @include flex(row, center, space-between);
    position: sticky;
    top: 0;
    z-index: 40;
    padding: 0.5rem 1rem;
    padding-top: calc(0.5rem + env(safe-area-inset-top));
    background: rgba($paper, 0.92);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid $line;

    img {
      height: 40px;
      width: auto;
    }

    @include from('lg') {
      display: none;
    }
  }

  &__top-actions {
    @include flex(row, center, flex-end, 0.25rem);
  }

  &__icon-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    @include flex(row, center, center);
    color: $ink-soft;

    &--on {
      color: $lime-deep;
    }
  }

  &__main {
    padding: 1.25rem 1rem calc(88px + env(safe-area-inset-bottom));

    @include from('md') {
      padding-inline: 1.75rem;
    }

    @include from('lg') {
      margin-left: $side-w;
      padding: 2rem 2.5rem 3rem;
    }
  }

  &__tabs {
    @include flex(row, stretch, space-around);
    position: fixed;
    inset: auto 0 0 0;
    z-index: 60;
    background: $ink;
    padding-bottom: env(safe-area-inset-bottom);

    @include from('lg') {
      display: none;
    }
  }

  &__tab {
    flex: 1;
    @include flex(column, center, center, 0.2rem);
    min-height: 62px;
    color: rgba($surface, 0.6);
    font-size: 0.7rem;
    font-weight: 600;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.2s ease;

    &.router-link-exact-active,
    &.router-link-active:not([href='/admin']) {
      color: $lime;
    }
  }

  &__tab-icon {
    position: relative;
    font-size: 1.15rem;
  }
}

.admin-page-enter-active,
.admin-page-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.25s $ease;
}
.admin-page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.admin-page-leave-to {
  opacity: 0;
}
</style>
