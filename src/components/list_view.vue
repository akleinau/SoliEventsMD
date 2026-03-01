<script setup lang="ts">

import { computed } from "vue";
import { useDataStore } from "../stores/dataStore.ts";
import { getCategoryDefinition } from "../constants/categoryConfig.ts";
import { ref } from 'vue'

const dataStore = useDataStore();

const search = ref('');
const headers = [
  { key: 'Was', title: 'Was', value: (item : any) => `${item.Was}` },
  { key: 'Wer', title: 'Wer' },
  { key: 'Wo', title: 'Wo' },
  { key: 'Wochentag', title: 'Wochentag', value: (item : any) => `${dataStore.getFormattedDay(item.Wochentag ?? '')}` },
  { key: 'Uhrzeit', title: 'Uhrzeit', value: (item : any) => `${item.Uhrzeit_Start}-${item.Uhrzeit_Ende}` }
];
/*const icons = [
  { key: 'was', title: 'Was', icon: 'mdi-newspaper-variant-outline', sortable: true, align: 'start' },
  { key: 'wer', title: 'Wer', icon: 'mdi-account-group', sortable: true, align: 'start' },
  { key: 'wo', title: 'Wo', icon: 'mdi-map-marker', sortable: true, align: 'start' },
  { key: 'tag', title: 'Wochentag', icon: 'mdi-calendar', sortable: true, align: 'start' },
  { key: 'uhrzeit', title: 'Uhrzeit', icon: null, sortable: true, align: 'start' },
];*/

const getRowProps = (item: any) => {
  const categoryColor = getCategoryDefinition(item.Kategorie)?.color;
  console.log(categoryColor);  
  return {
    class: '',
    style: `background-color: ${categoryColor} !important;`
  };
}

const emptyItem = computed(() => {
  return dataStore.getEmptyItem()
});

const clicked = (item: any) => {
  dataStore.set_current_item(item);
};

</script>

<template>
    
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    
    <v-data-table      
      :headers="headers"
      :items="dataStore.get_filtered_data()"
      :item-props="getRowProps"
      :search="search"
      :multi-sort="{ mode: 'append', modifier: 'alt' }"
    ></v-data-table>

    <v-table>
        <thead>
          <tr>
            <th><div><v-icon size="medium" class="pr-2" color="black">mdi-newspaper-variant-outline</v-icon> Was</div></th>
            <th><div><v-icon size="medium" class="pr-2" color="black">mdi-account-group</v-icon> Wer</div></th>
            <th><div><v-icon size="medium" class="pr-2" color="black">mdi-map-marker</v-icon> Wo</div></th>
            <th><div><v-icon size="medium" class="pr-2" color="black">mdi-calendar</v-icon> Wochentag</div></th>
            <th><div><!--v-icon size="medium" class="pr-2" color="black">mdi-clock</v-icon--> Uhrzeit</div></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataStore.get_filtered_data()" 
            link @click="clicked(item)"
            :style="{ 'cursor': 'pointer', 'background-color': dataStore.getCardColor(item.Kategorie ?? '') }">
            <td><v-icon size="medium" class="pr-2" color="black">{{ item.Unterkategorie ? dataStore.getSubCategoryIcon(item.Unterkategorie) : dataStore.getCategoryIcon(item.Kategorie) }}</v-icon> {{ item.Was }}</td>            
            <td>{{ item.Wer }}</td>
            <td>{{ item.Wo }}</td>
            <td>{{ dataStore.getFormattedDay(item.Wochentag ?? '') }}</td>
            <td>{{ item.Uhrzeit_Start }} - {{ item.Uhrzeit_Ende }}</td>
          </tr>
          <!-- Row für Neues Item (neues Angebot anlegen) -->
          <tr
            link @click="clicked(emptyItem)"
            :style="{ 'cursor': 'pointer', 'background-color': dataStore.getCardColor(emptyItem?.Kategorie ?? '') }">
            <td><v-icon size="medium" class="pr-2" color="black" >{{ dataStore.getCategoryIcon(emptyItem?.Kategorie) }}</v-icon> {{ emptyItem?.Was }}</td>
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


