<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { admin } from '@/config/admin'
import type { ApiError } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const t = admin.login

const email = ref('')
const password = ref('')
const error = ref('')
const sending = ref(false)

async function submit() {
  error.value = ''
  if (!email.value.trim() || !password.value) {
    error.value = t.missing
    return
  }
  sending.value = true
  try {
    const user = await userStore.login(email.value.trim(), password.value)
    if (user.accountType !== 'admin') {
      userStore.clear()
      error.value = t.notAdmin
      return
    }
    const next = typeof route.query.next === 'string' && route.query.next.startsWith('/admin') ? route.query.next : null
    router.replace(next || { name: 'AdminDashboard' })
  } catch (e) {
    error.value = (e as ApiError).message || admin.genericError
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="login">
    <form class="login__card" novalidate @submit.prevent="submit">
      <img class="login__logo" src="/brand/logo.png" alt="saborcito TROPICAL" width="180" height="72" />
      <h1 class="login__title">{{ t.title }}</h1>
      <p class="login__lead">{{ t.lead }}</p>

      <div class="login__field">
        <label for="login-email">{{ t.email }}</label>
        <input id="login-email" v-model="email" type="email" autocomplete="username" inputmode="email" required />
      </div>
      <div class="login__field">
        <label for="login-pass">{{ t.password }}</label>
        <input id="login-pass" v-model="password" type="password" autocomplete="current-password" required />
      </div>

      <Transition name="fade">
        <p v-if="error" class="login__error" role="alert">
          <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
        </p>
      </Transition>

      <button class="btn btn--dark btn--block login__submit" :class="{ 'login__submit--busy': sending }" :disabled="sending">
        {{ t.submit }}
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.login {
  min-height: 100dvh;
  @include flex(row, center, center);
  padding: 1.25rem;
  background-color: $lime;
  background-image: url('/brand/tile-3.webp'), url('/brand/tile-7.webp');
  background-size: 180px, 220px;
  background-position:
    0 0,
    90px 110px;

  &__card {
    @include flex(column, stretch, flex-start, 1rem);
    width: 100%;
    max-width: 400px;
    background: $surface;
    border-radius: $radius-lg;
    padding: 2rem 1.5rem 1.75rem;
    box-shadow: $shadow-pop, $shadow-lg;
    animation: login-in 0.5s $ease both;

    @include from('sm') {
      padding: 2.5rem 2.25rem 2.25rem;
    }
  }

  &__logo {
    height: 64px;
    width: auto;
    align-self: center;
  }

  &__title {
    @include display($text-xl, 700);
    text-align: center;
  }

  &__lead {
    text-align: center;
    color: $ink-soft;
    font-size: $text-sm;
    margin-top: -0.6rem;
  }

  &__field input {
    min-height: 48px;
    font-size: 1rem; // 16 px evita el zoom de iOS al enfocar
  }

  &__error {
    background: $danger-bg;
    color: $danger;
    font-size: $text-sm;
    font-weight: 600;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
  }

  &__submit {
    margin-top: 0.4rem;

    // Sin spinners: el botón respira mientras se valida
    &--busy {
      animation: busy 1s ease-in-out infinite alternate;
    }
  }
}

@keyframes login-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
}

@keyframes busy {
  to {
    opacity: 0.6;
  }
}
</style>
