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
            <th>Kategorie</th>
            <th>Was</th>
            <th>Wer</th>
            <th>Wo</th>
            <th>Wochentag</th>
            <th>Uhrzeit(en)</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="itemgroup in dataStore.get_grouped_data()" 
            :style="{ 'cursor': 'pointer' }"
            link @click="clicked(itemgroup)">

            <td class="subcategory-icons__container" :style="{ 'background-color': dataStore.getCardColor(itemgroup.Kategorie ?? '') }">              
                <template v-for="subcategoryName in dataStore.getSubCategoryNames(itemgroup.Unterkategorie)" :key="subcategoryName">
                  <v-tooltip :text="dataStore.getSubCategoryName(subcategoryName)" location="top" open-on-click>
                    <template v-slot:activator="{ props }">
                      <img v-if="dataStore.getSubCategorySvg(subcategoryName) != ''" v-bind="props" class="subcategory-list__icon" color="#3b3b3b" :src="dataStore.getSubCategorySvg(subcategoryName)"/>
                      <v-icon v-else class="subcategory-list__icon" v-bind="props" size="x-large">
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

          <!-- Extra Row für Neues Item (neues Angebot anlegen) -->
          <tr
            class="empty-card"
            :style="{ 'cursor': 'pointer' }"
            link @click="clicked(emptyItem)">

            <td>
              <v-tooltip :text="dataStore.getIconText(emptyItem)" location="top" open-on-click>
                <template v-slot:activator="{ props }">
                  <v-icon class="subcategory-list__icon" v-bind="props" size="x-large" >
                    {{ dataStore.getIcon(emptyItem) }}
                  </v-icon>
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

tbody, tr, td {
  min-height: 100%;
}

th {
  font-weight: bolder !important;
}

:deep(.v-table) tr, th, td {
  border-bottom: 1px solid var(--color-anthrazit) !important;
}
/* extra behaviour for last row with empty-entry item that needs colored border! */
:deep(.v-table__wrapper table tbody tr:last-child td) {  
  border-bottom: var(--empty-border-width) var(--empty-border-style) var(--color-light-green) !important;
}

.subcategory-icons__container {
  align-items: center;
  display: grid;
  grid-template-columns: auto auto;
  gap: 8px;
}

.subcategory-list__icon {
  width: 30px;
  height: 30px;
  margin: 1px;
  opacity: 0.9;
}

.empty-card {
  font-style: italic;
  --empty-border-width: 7px;
  --empty-border-style: solid;
}
/* alle Zellen der Zeile 'empty-card' haben oben und unten eine Border */
.empty-card td {
  border-top: var(--empty-border-width) var(--empty-border-style);
  border-top-color: var(--color-light-yellow);  
  /* BORDER-BOTTOM is already defined as exclusive rule above -> see ":deep(.v-table__wrapper table tbody tr:last-child td)"
    border-bottom: var(--empty-border-width) var(--empty-border-style);
    border-bottom-color: var(--color-light-green);*/
}
/* spezielles Styling für erste und letzte Zelle */
.empty-card td:first-child {
  border-left: var(--empty-border-width) var(--empty-border-style);
  border-left-color: var(--color-light-purple);
}
.empty-card td:last-child {
  border-right: var(--empty-border-width) var(--empty-border-style);
  border-right-color: var(--color-light-orange);
}

</style>


