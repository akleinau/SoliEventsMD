<!-- TimeslotEditor.vue -->
<script setup>
import { computed } from 'vue'
import { useDataStore } from "../stores/dataStore.ts";
import VueMultiselect from 'vue-multiselect'

const dataStore = useDataStore()

const props = defineProps({
  timeslot: { type: Object, required: true }
})

const sortedWochentage = dataStore.getSortedWochentageOptionen();

// 0. Suche im Nachschlage-Objekt vorbereiten --> alle Keys und Values vertauschen
const sortedWochentageOptionen = {}
const reverseSortedWochentageOptionen = {};
sortedWochentage.forEach(opt => {
  reverseSortedWochentageOptionen[opt.title] = opt.value;
  sortedWochentageOptionen[opt.value] = opt.title;
});

const sortedWochentageOptionenTitles = sortedWochentage.map(opt => opt.title);

// Helper: Extrahiert nur Wochentags-Namen (ohne Zahlen)
const extractDayNames = (dayNames) => {
  const result = dayNames.map(title => sortedWochentageOptionen[title]);  
  return result;
}

// Helper: Baut ausgewählte Wochentage mit Hilfs-Nummern neu zusammen
const rebuildDayNames = (selectedDayNames) => {
  console.log(selectedDayNames);
  // 1. Wert(e) ersetzen
  const fullDayNameValues = selectedDayNames.map(title => reverseSortedWochentageOptionen[title]);
  
  // 2. Werte sortieren
  const sortedFullDayNameValues = fullDayNameValues.sort();

  // 3. als String konvertieren mit ";" als Trennzeichen
  const arrayedFullDayNameValues = sortedFullDayNameValues.join("; ");

  return arrayedFullDayNameValues;
}

const selectedDays = computed({
  get: () => {
    const arr = Array.isArray(props.timeslot.Wochentag)
    ? props.timeslot.Wochentag
    : props.timeslot.Wochentag.split('; ').map(s => s.trim());
  
    const dayNames = extractDayNames(arr);
    return dayNames;
  },
  set: (selectedDayNames) => {    
    const newDayNames = rebuildDayNames(selectedDayNames)
    props.timeslot.Wochentag = newDayNames;
  }
})


</script>

<template>              
  <div class="timeslot-row">
    <input class="timeslot-rhythm" v-model="timeslot.Rhythmus" placeholder="Rhythmus" type="text" />
    <VueMultiselect 
        v-model="selectedDays" 
        :options="sortedWochentageOptionenTitles"
        :searchable="false"
        :multiple="true"
        :close-on-select="false"        
        placeholder="Wochentag(e)"
        class="timeslot-day">
    </VueMultiselect>
    <input class="timeslot-time" v-model="timeslot.Uhrzeit_Start" placeholder="Start" type="text" />
    <span>bis</span>
    <input class="timeslot-time" v-model="timeslot.Uhrzeit_Ende" placeholder="Ende" type="text" />
    <span>Uhr</span>
  </div>
</template>

<style>

.timeslot-day input {
  border: 0px solid lightgrey !important;    
}

input, .timeslot-day {
  background-color: white;
  padding: 0px 1px;
  border: 1px solid lightgrey !important;
  border-radius: 3px;
}

input, textarea {
  display: inline-block;
  width: 100%;
  max-width: 100%;
}

.timeslot-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  flex: 1 1 0;
  column-gap: 5px;
  min-width: 0;
}
.timeslot-day {
  flex: 0 1 190px;
  min-width: 0;
}
.timeslot-rhythm {
  flex: 1 1 0;
  min-width: 0;
}
.timeslot-time {
  flex: 0 0 70px;
  min-width: 0;
}

/* Mobile-Ansicht ToDo: fix code or this section -> use "@media ..."" OR use "".XYZ--mobile" ! */
@media (max-width: 767px) {

  input, textarea {
    display: inline-block;
    width: 100%;
    max-width: 100%;
  }
  .timeslot-row {
    flex-wrap: wrap;
    row-gap: 5px;
  }
  .timeslot-day, .timeslot-rhythm, .timeslot-time {
    flex: 1 1 auto;
  }
}
</style>