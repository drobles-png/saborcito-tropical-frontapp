<script setup lang="ts">
// Etiqueta + campo + pista o error inline. El error reemplaza a la pista, sin saltos de layout.
defineProps<{ id: string; label: string; hint?: string; error?: string; optional?: string }>()
</script>

<template>
  <div class="field" :class="{ 'field--error': error }">
    <label :for="id" class="field__label">
      {{ label }}
      <span v-if="optional" class="field__optional">{{ optional }}</span>
    </label>
    <slot />
    <Transition name="msg" mode="out-in">
      <p v-if="error" :id="`${id}-msg`" key="e" class="field__msg field__msg--error" role="alert">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
      </p>
      <p v-else-if="hint" :id="`${id}-msg`" key="h" class="field__msg">{{ hint }}</p>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.field {
  flex: 1 1 220px;
  min-width: 0;

  &__label {
    @include flex(row, baseline, space-between, 0.5rem);
    font-size: $text-sm;
    font-weight: 700;
    color: $ink;
  }

  &__optional {
    font-weight: 500;
    color: $ink-muted;
    font-size: $text-xs;
  }

  // 16px para que iOS no haga zoom al enfocar
  :slotted(input),
  :slotted(textarea) {
    font-size: 1rem;
    min-height: 52px;
    border-width: 2px;
    border-radius: 14px;
    padding: 0.75rem 1rem;

    &:focus {
      border-color: $ink;
      box-shadow: 0 0 0 4px rgba($lime, 0.45);
    }
  }

  :slotted(textarea) {
    resize: vertical;
    min-height: 88px;
  }

  &--error :slotted(input) {
    border-color: $danger;
  }

  &__msg {
    font-size: $text-xs;
    color: $ink-muted;
    margin-top: 0.35rem;
    line-height: 1.4;

    &--error {
      color: $danger;
      font-weight: 600;
    }
  }
}

.msg-enter-active,
.msg-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s $ease;
}
.msg-enter-from,
.msg-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
