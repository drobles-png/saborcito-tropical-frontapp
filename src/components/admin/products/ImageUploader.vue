<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { imageUrl } from '@/utils/format'
import { admin } from '@/config/admin'
import type { ApiError } from '@/types'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [url: string]; busy: [value: boolean] }>()
const t = admin.productForm
const toast = useToastStore()

const input = ref<HTMLInputElement>()
const preview = ref('')
const progress = ref(0)
const uploading = ref(false)
const over = ref(false)
let tick: ReturnType<typeof setInterval> | undefined

// shortcut: uploadImage no expone el progreso real; la barra avanza estimada hasta 90 % y completa al responder.
// Si hace falta exacto, añadir onUploadProgress en admin.service.
function fakeProgress() {
  progress.value = 6
  tick = setInterval(() => (progress.value += (90 - progress.value) * 0.08), 200)
}

async function take(file?: File) {
  if (!file || uploading.value) return
  if (!file.type.startsWith('image/')) return toast.error('Ese archivo no es una imagen.')
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = URL.createObjectURL(file)
  uploading.value = true
  emit('busy', true)
  fakeProgress()
  try {
    const { url } = await adminService.uploadImage(file)
    progress.value = 100
    emit('update:modelValue', url)
  } catch (e) {
    URL.revokeObjectURL(preview.value)
    preview.value = ''
    toast.error((e as ApiError).message || admin.genericError)
  } finally {
    clearInterval(tick)
    uploading.value = false
    emit('busy', false)
    setTimeout(() => (progress.value = 0), 500)
  }
}

function onDrop(e: DragEvent) {
  over.value = false
  take(e.dataTransfer?.files[0])
}

onUnmounted(() => {
  clearInterval(tick)
  if (preview.value) URL.revokeObjectURL(preview.value)
})
</script>

<template>
  <div class="uploader">
    <button
      type="button"
      class="uploader__drop"
      :class="{ 'uploader__drop--over': over, 'uploader__drop--has': preview || props.modelValue }"
      :aria-label="t.imageDrop"
      @click="input?.click()"
      @dragover.prevent="over = true"
      @dragleave="over = false"
      @drop.prevent="onDrop"
    >
      <img v-if="preview || modelValue" :src="preview || imageUrl(modelValue)" alt="" class="uploader__img" />
      <span v-else class="uploader__hint">
        <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i>
        {{ t.imageDrop }}
      </span>
      <span v-if="(preview || modelValue) && !uploading" class="uploader__change">{{ t.imageChange }}</span>
      <span v-if="progress" class="uploader__bar" :style="{ transform: `scaleX(${progress / 100})` }"></span>
    </button>
    <p class="uploader__spec">
      <i class="fa-solid fa-circle-info" aria-hidden="true"></i> {{ t.imageSpec }}
      <span v-if="uploading" class="uploader__status">· {{ t.uploading }}</span>
    </p>
    <input ref="input" type="file" accept="image/*" hidden @change="take(($event.target as HTMLInputElement).files?.[0])" />
  </div>
</template>

<style scoped lang="scss">
.uploader {
  @include flex(column, stretch, flex-start, 0.6rem);

  &__drop {
    position: relative;
    width: 100%;
    max-width: 320px;
    aspect-ratio: 1;
    border-radius: $radius-md;
    border: 2px dashed $line;
    background: #fff; // pozo blanco, igual que en la tienda
    overflow: hidden;
    @include flex(column, center, center);
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;

    &--over {
      border-color: $lime;
      background: $lime-soft;
    }

    &--has {
      border-style: solid;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    animation: pop 0.35s $ease;
  }

  &__hint {
    @include flex(column, center, center, 0.5rem);
    padding: 1.5rem;
    color: $ink-soft;
    font-weight: 600;
    font-size: $text-sm;
    text-align: center;

    i {
      font-size: 2rem;
      color: $lime-deep;
    }
  }

  &__change {
    position: absolute;
    bottom: 0.75rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba($ink, 0.82);
    color: $surface;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 0.35rem 0.85rem;
    border-radius: $radius-pill;
  }

  &__bar {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 6px;
    background: $lime;
    transform-origin: left;
    transition: transform 0.2s linear;
  }

  &__spec {
    font-size: $text-xs;
    color: $ink-muted;
    line-height: 1.5;
  }

  &__status {
    color: $lime-deep;
    font-weight: 700;
  }
}

@keyframes pop {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
}
</style>
