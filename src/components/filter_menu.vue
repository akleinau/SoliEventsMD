<script setup lang="ts">

import { useDataStore } from "../stores/dataStore.ts";
import { ref, computed } from "vue";

const dataStore = useDataStore();

// Wochentage
const wochentagFilter = ref<string[]>([]);
const weekdays = computed(() => {
  if (!dataStore.data) return [];
  const uniqueWeekdays = new Set(dataStore.data.map(item => item.Wochentag));
  let weekdays = Array.from(uniqueWeekdays).sort();
  weekdays = weekdays.map(day => {
    return { title: dataStore.format_weekday(day), value: day };
  });
  return weekdays
});

// Wer
const werFilter = ref<string[]>([]);
const wer = computed(() => {
  if (!dataStore.data) return [];
  const uniqueWer = new Set(dataStore.data.map(item => item.Wer));
  return Array.from(uniqueWer).sort();
});

</script>

<template>
  <div class="d-flex px-3 justify-center align-center flex-wrap " style="background: #f3f3f3; max-width:100%">
    <div class="mx-3">
      <h3>Filter nach: </h3>
    </div>
    <div class="FilterDiv">
      <v-select label="Wochentag"
        variant="outlined" multiple density="compact" hide-details bg-color="white"
        :items="weekdays" v-model="wochentagFilter"
        @update:modelValue="dataStore.add_filter('Wochentag', wochentagFilter)">
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index < 2">
            <span>{{ item.title }}</span>
          </v-chip>
          <span v-if="index === 2" class="text-grey text-caption align-self-center">
                  (+{{ wochentagFilter.length - 2 }} weitere)
          </span>
        </template>

      </v-select>
    </div>

    <div class="FilterDiv">
      <v-select label="Veranstalter"
        variant="outlined" multiple density="compact" hide-details bg-color="white"
        :items="wer" v-model="werFilter"
        @update:modelValue="dataStore.add_filter('Wer', werFilter)">
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index < 2">
            <span>{{ item.title }}</span>
          </v-chip>
          <span v-if="index === 2" class="text-grey text-caption align-self-center">
                  (+{{ werFilter.length - 2 }} weitere)
          </span>
        </template>
      </v-select>
    </div>

  </div>
</template>

<style scoped>

.FilterDiv {
  margin-inline: 10px;
  min-width: 300px;
  margin-bottom: 5px;
  margin-top: 5px;
}

</style>