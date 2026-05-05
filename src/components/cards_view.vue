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
      if (!list.includes(trimmed)){
        list.push(trimmed);
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
        :color="dataStore.getCardColor(itemgroup.Kategorie ?? '')"
        link @click="clicked(itemgroup)">
        <v-card-title class="category-card__title">{{ itemgroup.Was }}</v-card-title>
        <div class="category-card__icon" v-if="dataStore.getCategoryIcon(itemgroup.Kategorie)">
          <v-tooltip :text="dataStore.getIconText(itemgroup)" location="top" open-on-click>
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="large" color="black">{{ dataStore.getIcon(itemgroup) }}</v-icon>
            </template>
          </v-tooltip>
        </div>
        <v-card-subtitle>{{ itemgroup.Wer }}</v-card-subtitle>
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
        :color="dataStore.getCardColor(emptyItem?.Kategorie ?? '')"
        link @click="clicked(emptyItem)">
        <div class="category-card__icon" v-if="dataStore.getCategoryIcon(emptyItem?.Kategorie)">
          <v-tooltip :text="dataStore.getIconText(emptyItem)" location="top" open-on-click>
            <template v-slot:activator="{ props }">
                <v-icon v-bind="props" size="large" color="black">{{ dataStore.getIcon(emptyItem) }}</v-icon>
            </template>
          </v-tooltip>          
        </div>
        <v-card-title class="category-card__title">{{ emptyItem?.Was }}</v-card-title>
        <v-card-subtitle>{{ emptyItem?.Wer }}</v-card-subtitle>
        <v-card-text>
          <p class="mb-1"> <v-icon>mdi-map-marker</v-icon>  {{ emptyItem?.Wo }}</p>
          <p class="mb-1"> <v-icon>mdi-calendar</v-icon> {{ dataStore.getFormattedDay(emptyItem?.Wochentag ?? '')}}</p>
        </v-card-text>
    </v-card>

</template>

<style scoped>

.v-icon {
  color: #727272;
}


.category-card {
  position: relative;
  overflow: hidden;
}

.category-card__title {
  padding-right: 64px;
  overflow-wrap: break-word;
}

.category-card__icon {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 30px;
  height: 30px;
  opacity: 0.9;
}

.category-card__icon img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

</style>


