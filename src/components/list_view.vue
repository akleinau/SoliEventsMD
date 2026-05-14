<script setup lang="ts">

import { computed } from "vue";
import { useDataStore } from "../stores/dataStore.ts";

const dataStore = useDataStore()

const emptyItem = computed(() => {
  return dataStore.getEmptyItem()
});
  
const emit = defineEmits<{
  (e: 'itemgroup-clicked', itemgroup: any): void
}>()

const clicked = (itemgroup: any) => {
  emit('itemgroup-clicked', itemgroup);
}

</script>

<template>

    <v-table>
        <thead>
          <tr>
            <th>Was</th>
            <th>Wer</th>
            <th>Wo</th>
            <th>Wochentag</th>
            <th>Uhrzeit(en)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="itemgroup in dataStore.get_grouped_data()" 
            link @click="clicked(itemgroup)"
            :style="{ 'cursor': 'pointer', 'background-color': dataStore.getCardColor(itemgroup.Kategorie ?? '') }">
            <td>
              <v-tooltip :text="dataStore.getIconText(itemgroup)" location="top" open-on-click>
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="medium" class="pr-2" color="black" >{{ dataStore.getIcon(itemgroup) }}</v-icon>
                </template>
              </v-tooltip>
              {{ itemgroup.Was }}
            </td>
            <td>{{ itemgroup.Wer }}</td>
            <td v-if="itemgroup.Kategorie != 'digitales'">{{ itemgroup.Wo }}</td>
            <td v-if="itemgroup.Kategorie != 'digitales'">
              <tr  v-for="timeslot in itemgroup.timeSlots">{{ dataStore.getFormattedDay(timeslot.Wochentag ?? '') }}</tr>
            </td>
            <td v-if="itemgroup.Kategorie != 'digitales'">
              <tr  v-for="timeslot in itemgroup.timeSlots">{{ timeslot.Uhrzeit_Start }} - {{ timeslot.Uhrzeit_Ende }}</tr>
            </td>
            <td v-if="itemgroup.Kategorie == 'digitales'" colspan="3">{{ itemgroup.Link }}</td>
          </tr>
          <!-- Row für Neues Item (neues Angebot anlegen) -->
          <tr
            link @click="clicked(emptyItem)"
            :style="{ 'cursor': 'pointer', 'background-color': dataStore.getCardColor(emptyItem?.Kategorie ?? '') }">
            <td>
              <v-tooltip :text="dataStore.getIconText(emptyItem)" location="top" open-on-click>
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="medium" class="pr-2" color="black" >{{ dataStore.getIcon(emptyItem) }}</v-icon>
                </template>
              </v-tooltip>
              {{ emptyItem?.Was }}
            </td>
            <td>{{ emptyItem?.Wer }}</td>
            <td>{{ emptyItem?.Wo }}</td>
            <td>{{ dataStore.getFormattedDay(emptyItem?.Wochentag ?? '') }}</td>
            <td>{{ emptyItem?.Uhrzeit_Start }} - {{ emptyItem?.Uhrzeit_Ende }}</td>
          </tr>
        </tbody>
    </v-table>

</template>

<style scoped>

.v-icon {
  color: #727272;
}

th {
  font-weight: bolder !important;
}

</style>


