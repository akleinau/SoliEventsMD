<script setup lang="ts">
import { computed } from "vue";
import { useDataStore } from "../stores/dataStore.ts";

const dataStore = useDataStore();
const props = defineProps<{ timeslot: Record<string, any> }>();

const items = dataStore.getSortedWochentageOptionen();

const selectedDays = computed<string[]>({
  get: () => (props.timeslot.Wochentag ?? "").split(";").map((s: string) => s.trim()).filter(Boolean),
  set: (vals) => { props.timeslot.Wochentag = [...vals].sort().join("; "); },
});
</script>

<template>
  <v-select placeholder="Wochentag" variant="outlined" multiple density="compact" hide-details
    bg-color="white" :items="items" item-title="title" item-value="value"
    v-model="selectedDays" class="inline-select timeslot-day-select">
    <template #selection="{ item, index }">
      <span v-if="index < 2" class="sel-text">{{ index > 0 ? ", " : "" }}{{ item.title }}</span>
      <span v-if="index === 2" class="sel-more">&nbsp;(+{{ selectedDays.length - 2 }})</span>
    </template>
  </v-select>
</template>

<style scoped>
.timeslot-day-select {
  flex: 1 1 180px;
  min-width: 0;
}
.sel-text { white-space: nowrap; }
.sel-more { white-space: nowrap; color: grey; font-size: 0.8em; align-self: center; }

/* make the field look like the plain text inputs next to it */
.inline-select :deep(.v-field) {
  background: white;
  border: 1px solid lightgrey;
  border-radius: 3px;
  font-size: inherit;
}
.inline-select :deep(.v-field__outline) { display: none; }
.inline-select :deep(.v-field__input) {
  min-height: 23px;
  padding: 0 1px;
  font-size: inherit;
  --v-input-chips-margin-top: 0;
  --v-input-chips-margin-bottom: 0;
  flex-wrap: nowrap;
}
.inline-select :deep(.v-field__append-inner) {
  padding-top: 0;
  align-items: center;
}
.inline-select :deep(.v-field--appended) { padding-inline-end: 2px; }
.inline-select :deep(.v-select__selection) { margin-inline-end: 0; }
</style>
