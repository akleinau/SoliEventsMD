<script setup lang="ts">

import { computed } from "vue";
import { useDataStore } from "../stores/dataStore.ts";

const dataStore = useDataStore();

const emptyItem = computed(() => {
  return dataStore.getEmptyItem()
});

const listTimeSlots = (timeSlots: any) => {
  var list = [] as string[];
  for (var timeSlot of timeSlots) {
    // get formatted day removes the prefix, e.g. "54" of "54 Donnerstag"
    //var day = dataStore.getFormattedDay(timeSlot.Wochentag ?? '')
    // split string, to deal with a Wochentag containing multiple days
    const parts = timeSlot.Wochentag.split(/[;,]/);
    for (var part of parts) {      
      // trim to remove a leftover space after a comma (possible after splitting)
      const trimmed = part.trim();
      // get nice Wochentag format without numbers in front
      const formatted = dataStore.getFormattedDay(trimmed ?? '')
      if (!list.includes(formatted)){
        list.push(formatted);
      }
    }
  }

  // wenn alle Tage der Woche => nur "alle Tage"
  const allDays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
  const weekenddays = ['Samstag', 'Sonntag'];

  if (allDays.every(day => list.includes(day))) {
    const filtered = list.filter(day => !allDays.includes(day));
    list = [...filtered, ...(list.includes('alle Tage') ? [] : ['alle Tage'])];
  }

  if (weekdays.every(day => list.includes(day))) {
    // ggf. die Wochentage entfernen, aber Sa/So stehen lassen, sofern vorhanden
    const filtered = list.filter(day => !weekdays.includes(day));
    list = [...filtered, ...(list.includes('wochentags') ? [] : ['wochentags'])];
  }

  if (weekenddays.every(day => list.includes(day))) {
    const filtered = list.filter(day => !weekenddays.includes(day));
    list = [...filtered, ...(list.includes('Wochenende') ? [] : ['Wochenende'])];
  }

  // sort by day of a week Mo->So
  const sortedList = dataStore.sortFormattedDays(list);
  // shorten all day names
  const shortedList = dataStore.shortFormattedDays(sortedList);
  return shortedList.join(', ');
};

const emit = defineEmits<{
  (e: 'itemgroup-clicked', itemgroup: any): void
}>()

const clicked = (itemgroup: any) => {
  emit('itemgroup-clicked', itemgroup);
}

</script>

<template>

    <v-card
        v-for="itemgroup in dataStore.get_grouped_data()" 
        class="ma-2 category-card" 
        width="350"
        max-height="180"
        color="var(--color-white)"
        link @click="clicked(itemgroup)">
        <div class="category-card__header" :style="{'background-color' : dataStore.getCardColor(itemgroup.Kategorie)}">
          <v-card-title class="category-card__title"            
          >{{ itemgroup.Was }}</v-card-title>

          <div class="category-card__icons">
            <template v-for="subcategoryName in dataStore.getSubCategoryNames(itemgroup.Unterkategorie)" :key="subcategoryName">
              <v-tooltip :text="dataStore.getSubCategoryName(subcategoryName)" location="top" open-on-click>
                <template v-slot:activator="{ props }">
                  <v-icon class="category-card__icon" v-bind="props" size="x-large">
                    {{ dataStore.getSubCategoryIcon(subcategoryName) }}
                  </v-icon>
                </template>
              </v-tooltip>
            </template>
          </div>
        </div>

        <v-card-subtitle :style="{'padding-top' : '5px'}">{{ itemgroup.Wer }}</v-card-subtitle>
        <v-card-text v-if="itemgroup.Kategorie != 'digitales'">
          <p class="mb-1"> <v-icon>mdi-map-marker</v-icon> {{ itemgroup.Wo }}</p>
          <div class="mb-1 opening-hours"> <v-icon>mdi-calendar</v-icon> {{ listTimeSlots(itemgroup.timeSlots) }}</div>
        </v-card-text>
        <v-card-text v-if="itemgroup.Kategorie == 'digitales'">
          <p class="mb-1"> <v-icon>mdi-web</v-icon>  {{ itemgroup.Link }}</p>
        </v-card-text>
    </v-card>

    <v-card
        class="ma-2 category-card" 
        width="350"
        max-height="180"
        color="var(--color-white)"
        link @click="clicked(emptyItem)">
        <div class="category-card__header" :style="{'background-color' : dataStore.getCardColor(emptyItem?.Kategorie)}">
          <v-card-title class="category-card__title"            
            >{{ emptyItem?.Was }}</v-card-title>

          <div class="category-card__icons">
            <div v-if="dataStore.getCategoryIcon(emptyItem?.Kategorie)">
              <v-tooltip :text="dataStore.getIconText(emptyItem)" location="top" open-on-click>
                <template v-slot:activator="{ props }">
                  <v-icon class="category-card__icon" v-bind="props" size="x-large">
                    {{ dataStore.getIcon(emptyItem) }}
                  </v-icon>
                </template>
              </v-tooltip>          
            </div>
          </div>
        </div>
        <v-card-subtitle :style="{'padding-top' : '5px'}">{{ emptyItem?.Wer }}</v-card-subtitle>
        <v-card-text>
          <p class="mb-1"> <v-icon>mdi-map-marker</v-icon>  {{ emptyItem?.Wo }}</p>
          <p class="mb-1"> <v-icon>mdi-calendar</v-icon> {{ dataStore.getFormattedDay(emptyItem?.Wochentag ?? '')}}</p>
        </v-card-text>
    </v-card>

</template>

<style scoped>

.category-card {
  position: relative;
  overflow: hidden;
}

.category-card__header {
  display: grid;
  grid-template-columns: auto auto;
}

.category-card__title {
  padding-right: 20px;
  overflow-wrap: break-word;
}

.category-card__icons {
  justify-self: end;
}

.category-card__icon {
  top: 8px;
  right: 8px;
  width: 30px;
  height: 30px;
  margin: 1px;
  opacity: 0.9;
}

.category-card__icon img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

</style>


