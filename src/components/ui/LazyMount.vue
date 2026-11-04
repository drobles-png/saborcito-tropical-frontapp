<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Monta su contenido cuando se acerca a la pantalla (o cuando el navegador queda libre).
// El home pintaba todas sus secciones de golpe al llegar el menú y esa sola tarea
// trababa la entrada del hero en el celular.
const props = withDefaults(defineProps<{ minHeight?: string; margin?: string }>(), {
  minHeight: '60vh',
  margin: '120% 0px',
})

const root = ref<HTMLElement | null>(null)
const shown = ref(false)
let io: IntersectionObserver | null = null
let idle: number | undefined

function show() {
  shown.value = true
  io?.disconnect()
  if (idle !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle)
}

onMounted(() => {
  if (!('IntersectionObserver' in window)) return show()
  io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && show(), {
    rootMargin: props.margin,
  })
  if (root.value) io.observe(root.value)
  // Aunque no se haga scroll, se monta en un momento libre: así anclas y Ctrl+F encuentran todo.
  if ('requestIdleCallback' in window) idle = window.requestIdleCallback(show, { timeout: 4000 })
})

onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <slot v-if="shown" />
  <div v-else ref="root" class="lazy" :style="{ minHeight }" aria-hidden="true"></div>
</template>
