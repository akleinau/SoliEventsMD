<script setup lang="ts">

import {useDataStore} from "../stores/dataStore.ts";
import {computed, onMounted, ref, watch} from "vue";

const dataStore = useDataStore()

const active = ref(true)

onMounted(() => {
  active.value = true
})

watch(() => active.value, (newValue) => {
  if (!newValue) {
    dataStore.current_item = null
    dataStore.clear_focused_item()
  }
})

const item = computed(() => dataStore.current_item)

const isVerificationStale = computed(() => {
  if (!item.value) {
    return false;
  }
  return dataStore.shouldShowVerificationWarning(item.value);
});

const verificationLabel = computed(() => {
  if (!item.value) {
    return null;
  }
  return dataStore.getVerificationLabel(item.value.Letzte_Ueberpruefung);
});

const verificationWarning = computed(() => {
  if (!item.value) {
    return null;
  }
  return dataStore.getVerificationWarning(item.value.Letzte_Ueberpruefung);
});

// Werbegrafik image handling
const werbegrafikPath = computed(() => {
  return dataStore.getWerbegrafikPath(item.value);
});

const werbegrafikError = ref(false);

// Reset error state when item changes
watch(() => item.value, () => {
  werbegrafikError.value = false;
});

const handleWerbegrafikError = () => {
  werbegrafikError.value = true;
};

const showWerbegrafik = computed(() => {
  return werbegrafikPath.value && !werbegrafikError.value;
});

</script>

<template>
  <v-dialog 
    v-model="active" 
    style="max-width: 1000px" 
    :attach="'.datatable-wrapper'" 
    :contained="true" 
    :scrim="false"
    :persistent="true"
    :no-click-animation="true"
    content-class="dialog-content-shifted"
  >
    <v-card 
      v-if="item"
      :style="{
        'background': dataStore.getCardColor(item.Kategorie), 
        'border': '5px solid color-mix(in oklch, ' + dataStore.getCardColor(item.Kategorie) + ', black 20%)'
      }">
      <v-card-title class="dialog-title">
        <span>{{ item.Was }}</span>
        <v-icon size="x-large" color="black" class="dialog-title__icon">{{ dataStore.getCategoryIcon(item.Kategorie) }}</v-icon>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" :md="showWerbegrafik ? 7 : 12">
            <p class="mb-3 text-subtitle-1 text-medium-emphasis">{{ item.Wer }}</p>
            <p class="mb-1"> <v-icon>mdi-map-marker</v-icon> {{ item.Wo }}</p>
            <p class="mb-1"> <v-icon>mdi-calendar</v-icon> {{ dataStore.getFormattedDay(item.Wochentag ?? '') }}, {{ item.Rhythmus }}</p>
            <p class="mb-1"> <v-icon>mdi-clock</v-icon> {{ item.Uhrzeit_Start }} - {{ item.Uhrzeit_Ende }}</p>
            <p class="mt-5">
              <a :href="item.Link" target="_blank">{{ item.Link }}</a>
            </p>
          </v-col>

          <v-col v-if="showWerbegrafik" cols="12" md="5">
            <v-img
                :src="werbegrafikPath!"
                class="werbegrafik-image"
                max-height="300"
                contain
                @error="handleWerbegrafikError"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
        </v-row>

        <p
            v-if="!isVerificationStale"
            class="mt-5 text-grey-darken-1"
        >
          Letzte Überprüfung: {{ verificationLabel ?? 'keine Angabe' }}
        </p>
        <v-alert
            v-else
            type="warning"
            variant="tonal"
            density="compact"
            class="mt-5"
        >
          {{ verificationWarning ?? 'Achtung!' }}
        </v-alert>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>

a {
  color: grey;
}

.dialog-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 16px;
}

.dialog-title__icon {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  opacity: 0.85;
}

.werbegrafik-image {
  border-radius: 8px;
  overflow: hidden;
}

</style>

<style>
/* Global style to shift dialog up */
.dialog-content-shifted {
  margin-top: -15vh !important;
}
</style>