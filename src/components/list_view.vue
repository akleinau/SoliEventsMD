<script setup lang="ts">

import { useDataStore } from "../stores/dataStore.ts";

const dataStore = useDataStore()

const clicked = (item: any) => {
  dataStore.set_current_item(item);
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
            <td><v-icon size="medium" class="pr-2" color="black" >{{ dataStore.getCategoryIcon(item.Kategorie) }}</v-icon> {{ item.Was }}</td>
            <td>{{ item.Wer }}</td>
            <td>{{ item.Wo }}</td>
            <td>{{ dataStore.getFormattedDay(item.Wochentag ?? '') }}</td>
            <td>{{ item.Uhrzeit_Start }} - {{ item.Uhrzeit_Ende }}</td>
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


