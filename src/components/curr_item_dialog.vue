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

</script>

<template>
  <v-dialog v-model="active" style="max-width: 1000px">
    <v-card v-if="item">
      <v-card-title class="dialog-title">
        <span>{{ item.Was }}</span>
        <img
            v-if="dataStore.getCategoryIcon(item.Kategorie)"
            class="dialog-title__icon"
            :src="dataStore.getCategoryIcon(item.Kategorie)"
            :alt="`Icon für ${item.Kategorie}`"
        />
      </v-card-title>
      <v-card-subtitle>{{ item.Wer }}</v-card-subtitle>
      <v-card-text>
        <p class="mb-1"> <v-icon>mdi-map-marker</v-icon> {{ item.Wo }}</p>
        <!--p class="mb-1"> <v-icon>mdi-calendar</v-icon> {{ dataStore.format_weekday(item.Wochentag ?? '') }}, {{ item.Rhythmus }}</p-->
        <p class="mb-1"> <v-icon>mdi-calendar</v-icon> {{ dataStore.getFormattedDay(item.Wochentag ?? '') }}, {{ item.Rhythmus }}</p>
        <p class="mb-1"> <v-icon>mdi-clock</v-icon> {{ item.Uhrzeit_Start }} - {{ item.Uhrzeit_Ende }}</p>
        <p class="mt-5">
          <a :href="item.Link" target="_blank">{{ item.Link }}</a>
        </p>

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
            density="comfortable"
            class="mt-5"
        >
          {{ verificationWarning ?? 'Achtung!' }}
        </v-alert>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>

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

</style>