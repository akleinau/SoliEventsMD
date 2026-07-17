<!-- TimeslotEditor.vue -->
<script setup>
import { computed } from 'vue'
import { useDataStore } from "../stores/dataStore.ts";
import VueMultiselect from 'vue-multiselect'

const dataStore = useDataStore()

const props = defineProps({
  timeslot: { type: Object, required: true }
})

// Helper: Extrahiert nur Wochentags-Namen (ohne Zahlen)
const extractDayNames = () => {
  var str = props.timeslot.Wochentag
  if (!str) return []
  return str
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .map(part => {
      const match = part.match(/^\d+\s+(.+)$/)
      return match ? match[1].trim() : part.trim()
    })
}

// Helper: Baut String mit originalen/beibehaltenen Nummern neu zusammen
const rebuildWochentagString = (newDayNames) => {
  // 1. Existing entries parsen
  const existing = (props.timeslot.Wochentag || '')
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
    .map(part => {
      const match = part.match(/^(\d+)\s+(.+)$/)
      return match
        ? { number: parseInt(match[1]), tag: match[2].trim() }
        : { number: 0, tag: part }
    })

  // 2. Lookup: tag → number
  const numberByTag = {}
  existing.forEach(e => {
    if (!(e.tag in numberByTag)) numberByTag[e.tag] = e.number
  })

  // 3. Nächste Nummer für neue Einträge (max + 1)
  const maxNumber = existing.length > 0
    ? Math.max(...existing.map(e => e.number))
    : 0
  let nextNumber = maxNumber + 1

  // 4. Neu aufbauen
  return newDayNames.map(tag => {
    if (tag in numberByTag) {
      return `${numberByTag[tag]} ${tag}`
    }
    return `${nextNumber++} ${tag}`
  }).join('; ')
}

const selectedDays = computed({
  get: () => {
    const dayNames = extractDayNames(props.timeslot.Wochentag)
    // Finde passende Objekte aus sortedWochentageOptionen
    return sortedWochentageOptionen.filter(opt => dayNames.includes(opt.title)).map(opt => opt.title)
  },
  set: (newArray) => {
    // newArray = [{value:'montag', title:'Montag'}, ...]
    const dayNames = newArray.map(obj => obj.title)
    props.timeslot.Wochentag = rebuildWochentagString(dayNames)
  }
})

const sortedWochentageOptionen = dataStore.getSortedWochentageOptionen();
const sortedWochentageOptionenTitles = sortedWochentageOptionen.map(opt => opt.title);

</script>

<template>
  <div class="timeslot-row">
    <input class="timeslot-rhythm" v-model="timeslot.Rhythmus" placeholder="Rhythmus" type="text" />
    <VueMultiselect 
        v-model="selectedDays" 
        :options="sortedWochentageOptionenTitles"
        :multiple="true"
        :close-on-select="false"
        placeholder="Wochentage"
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