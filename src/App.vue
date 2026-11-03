<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import ToastList from '@/components/ui/ToastList.vue'

// El chrome de compra solo existe en la parte pública; el panel no lo descarga.
const CartDrawer = defineAsyncComponent(() => import('@/components/cart/CartDrawer.vue'))
const CartBar = defineAsyncComponent(() => import('@/components/cart/CartBar.vue'))
const ProductSheet = defineAsyncComponent(() => import('@/components/menu/ProductSheet.vue'))
const WhatsappFloat = defineAsyncComponent(() => import('@/layout/WhatsappFloat.vue'))

const route = useRoute()
const layout = computed(() => (route.meta.layout as string) || 'public')
</script>

<template>
  <div class="app" :class="`app--${layout}`">
    <template v-if="layout === 'public'">
      <TheHeader />
      <main class="app__main">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
      <TheFooter />
      <ProductSheet />
      <CartDrawer />
      <CartBar v-if="!route.meta.hideCartBar" />
      <WhatsappFloat />
    </template>

    <RouterView v-else />

    <ToastList />
  </div>
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
