<script setup lang="ts">

import { computed } from "vue";
import { useDataStore } from "../stores/dataStore.ts";

const dataStore = useDataStore()

const emptyItem = computed(() => {
  return dataStore.getEmptyItem()
});
  
const emit = defineEmits<{
  (e: 'item-clicked', item: any): void
}>()

const clicked = (item: any) => {
  emit('item-clicked', item);
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
            <th>Uhrzeit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataStore.get_filtered_data()" 
            link @click="clicked(item)"
            :style="{ 'cursor': 'pointer', 'background-color': dataStore.getCardColor(item.Kategorie ?? '') }">
            <td>
              <v-tooltip :text="dataStore.getIconText(item)" location="top" open-on-click>
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props" size="medium" class="pr-2" color="black" >{{ dataStore.getIcon(item) }}</v-icon>
                </template>
              </v-tooltip>
              {{ item.Was }}
            </td>
            <td>{{ item.Wer }}</td>
            <td>{{ item.Wo }}</td>
            <td>{{ dataStore.getFormattedDay(item.Wochentag ?? '') }}</td>
            <td>{{ item.Uhrzeit_Start }} - {{ item.Uhrzeit_Ende }}</td>
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


