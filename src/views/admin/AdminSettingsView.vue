<script setup lang="ts">
import SettingsBlock from '@/components/admin/settings/SettingsBlock.vue'
import BranchesEditor from '@/components/admin/settings/BranchesEditor.vue'
import AdminSwitch from '@/components/admin/ui/AdminSwitch.vue'
import MoneyInput from '@/components/admin/ui/MoneyInput.vue'
import { useSettingsForm } from '@/composables/admin/useSettingsForm'
import { admin } from '@/config/admin'

const t = admin.settings
const { form, saving, dirty, save, discard } = useSettingsForm()
</script>

<template>
  <section class="settings">
    <h1 class="settings__title">{{ t.title }}</h1>

    <div v-if="!form" class="settings__blocks">
      <div v-for="n in 4" :key="n" class="skeleton settings__ghost"></div>
    </div>

    <form v-else class="settings__blocks" novalidate @submit.prevent="save">
      <SettingsBlock :title="t.blocks.store" icon="fa-solid fa-store">
        <AdminSwitch v-model="form.storeOpen" :label="t.storeOpen" />
        <div>
          <label for="s-closed">{{ t.closedMessage }}</label>
          <input id="s-closed" v-model="form.closedMessage" />
        </div>
        <div>
          <label for="s-hours">{{ t.openingHours }}</label>
          <input id="s-hours" v-model="form.openingHours" />
        </div>
        <div>
          <label for="s-ann">{{ t.announcement }}</label>
          <input id="s-ann" v-model="form.announcement" />
        </div>
      </SettingsBlock>

      <SettingsBlock :title="t.blocks.contact" icon="fa-solid fa-address-book">
        <div class="pair">
          <div>
            <label for="s-wa">{{ t.whatsapp }}</label>
            <input id="s-wa" v-model="form.whatsapp" inputmode="tel" />
          </div>
          <div>
            <label for="s-mail">{{ t.notifyEmail }}</label>
            <input id="s-mail" v-model="form.notifyEmail" type="email" inputmode="email" />
          </div>
        </div>
      </SettingsBlock>

      <SettingsBlock :title="t.blocks.delivery" icon="fa-solid fa-motorcycle">
        <div class="pair">
          <div>
            <label for="s-fee">{{ t.deliveryFee }}</label>
            <MoneyInput id="s-fee" v-model="form.deliveryFee" />
          </div>
          <div>
            <label for="s-free">{{ t.freeDeliveryFrom }}</label>
            <MoneyInput id="s-free" v-model="form.freeDeliveryFrom" />
          </div>
          <div>
            <label for="s-min">{{ t.minOrder }}</label>
            <MoneyInput id="s-min" v-model="form.minOrder" />
          </div>
        </div>
        <div class="pair">
          <div>
            <label for="s-eta">{{ t.deliveryEta }}</label>
            <input id="s-eta" v-model="form.deliveryEta" />
          </div>
          <div>
            <label for="s-peta">{{ t.pickupEta }}</label>
            <input id="s-peta" v-model="form.pickupEta" />
          </div>
        </div>
        <div>
          <label for="s-zones">{{ t.deliveryZones }}</label>
          <textarea id="s-zones" v-model="form.deliveryZones" rows="2"></textarea>
        </div>
      </SettingsBlock>

      <SettingsBlock :title="t.blocks.branches" icon="fa-solid fa-location-dot">
        <BranchesEditor v-model="form.branches" />
      </SettingsBlock>

      <SettingsBlock :title="t.blocks.payments" icon="fa-solid fa-wallet">
        <div class="settings__switches">
          <AdminSwitch v-model="form.paymentMethods.cash" :label="t.cash" />
          <AdminSwitch v-model="form.paymentMethods.transfer" :label="t.transfer" />
          <AdminSwitch v-model="form.paymentMethods.card" :label="t.card" />
        </div>
        <p class="settings__note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> {{ t.cardNote }}</p>
        <div>
          <label for="s-bank">{{ t.bankInfo }}</label>
          <textarea id="s-bank" v-model="form.bankInfo" rows="5"></textarea>
        </div>
      </SettingsBlock>

      <Transition name="bar">
        <div v-if="dirty" class="settings__bar" role="status">
          <span class="settings__unsaved">{{ t.unsaved }}</span>
          <button type="button" class="btn btn--ghost btn--sm" @click="discard">{{ t.discard }}</button>
          <button type="submit" class="btn btn--lime btn--sm" :disabled="saving">{{ t.save }}</button>
        </div>
      </Transition>
    </form>
  </section>
</template>

<style scoped lang="scss">
.settings {
  @include flex(column, stretch, flex-start, 1rem);
  max-width: 860px;
  padding-bottom: 5rem;

  &__title {
    @include display($display-sm, 700);
  }

  &__blocks {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__ghost {
    height: 220px;
    border-radius: 14px;
  }

  &__switches {
    @include flex(row, center, flex-start, 0.25rem 1.5rem);
    flex-wrap: wrap;
  }

  &__note {
    font-size: $text-sm;
    color: $ink-soft;
    background: $sand;
    border-radius: $radius-sm;
    padding: 0.55rem 0.8rem;
  }

  // Barra fija de guardar: aparece solo cuando hay cambios
  &__bar {
    position: fixed;
    left: 1rem;
    right: 1rem;
    bottom: calc(74px + env(safe-area-inset-bottom));
    z-index: 70;
    @include flex(row, center, flex-end, 0.5rem);
    flex-wrap: wrap;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-md;
    background: $ink;
    color: $surface;
    box-shadow: $shadow-lg;

    .btn--ghost {
      color: $surface;
    }

    @include from('lg') {
      left: calc(248px + 2.5rem);
      right: 2.5rem;
      bottom: 1.25rem;
      max-width: 860px;
    }
  }

  &__unsaved {
    margin-right: auto;
    font-weight: 600;
    font-size: $text-sm;
  }
}

.bar-enter-active,
.bar-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s $ease;
}
.bar-enter-from,
.bar-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
