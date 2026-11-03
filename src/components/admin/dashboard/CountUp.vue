<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { formatCents } from '@/utils/format'

// Cifra que sube desde la anterior hasta el valor nuevo (ease-out, ~0.9 s).
const props = defineProps<{ value: number; money?: boolean }>()
const shown = ref(0)
let raf = 0

function animate(from: number, to: number) {
  cancelAnimationFrame(raf)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = to
    return
  }
  const start = performance.now()
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / 900)
    shown.value = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)))
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

watch(() => props.value, (to, from) => animate(from ?? 0, to), { immediate: true })
onUnmounted(() => cancelAnimationFrame(raf))
</script>

<template>
  <span class="count" :aria-label="money ? formatCents(value) : String(value)">
    <span aria-hidden="true">{{ money ? formatCents(shown) : shown }}</span>
  </span>
</template>

<style scoped lang="scss">
.count {
  font-variant-numeric: tabular-nums;
}
</style>
