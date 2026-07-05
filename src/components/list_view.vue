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
            <th>Icons</th>
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
            :style="{ 'cursor': 'pointer' }">

            <td :style="{ 'background-color': dataStore.getCardColor(itemgroup.Kategorie ?? '') }">              
                <template v-for="subcategoryName in dataStore.getSubCategoryNames(itemgroup.Unterkategorie)" :key="subcategoryName">
                  <v-tooltip :text="dataStore.getSubCategoryName(subcategoryName)" location="top" open-on-click>
                    <template v-slot:activator="{ props }">
                      <v-icon class="category-list__icon" v-bind="props" size="x-large">
                        {{ dataStore.getSubCategoryIcon(subcategoryName) }}
                      </v-icon>
                    </template>
                  </v-tooltip>
                </template>
            </td>

            <td :style="{ 'font-weight': 'bold', 'background-color': dataStore.getCardColor(itemgroup.Kategorie ?? '') }">
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
                  <v-icon v-bind="props" size="medium" class="pr-2">{{ dataStore.getIcon(emptyItem) }}</v-icon>
                </template>
              </v-tooltip>
            </td>

            <td>{{ emptyItem?.Was }}</td>

            <td>{{ emptyItem?.Wer }}</td>

            <td>{{ emptyItem?.Wo }}</td>

            <td>{{ dataStore.getFormattedDay(emptyItem?.Wochentag ?? '') }}</td>

            <td>{{ emptyItem?.Uhrzeit_Start }} - {{ emptyItem?.Uhrzeit_Ende }}</td>

          </tr>
        </tbody>
    </v-table>

</template>

<style scoped>

th {
  font-weight: bolder !important;
}

.category-list__icon {
  width: 30px;
  height: 30px;
  margin: 1px;
  opacity: 0.9;
}

</style>


