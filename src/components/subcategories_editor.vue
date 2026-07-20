<script setup lang="ts">
import { computed } from "vue";
import { SUB_CATEGORIES } from "../constants/categoryConfig";

const props = defineProps<{ editableItemGroup: Record<string, any> }>();

const items = SUB_CATEGORIES.map(s => ({ value: s.path, title: s.label, icon: s.icon }));

const selected = computed<string[]>({
  get: () => (props.editableItemGroup.Unterkategorie ?? "").split(";").map((s: string) => s.trim()).filter(Boolean),
  set: (vals) => { props.editableItemGroup.Unterkategorie = vals.join("; "); },
});
</script>

<template>
  <v-select placeholder="wählen…" variant="outlined" multiple density="compact" hide-details
    bg-color="white" :items="items" v-model="selected" class="inline-select subcat-select"
    :item-props="(item) => ({ disabled: selected.length >= 2 && !selected.includes(item.value) })">
    <template #selection="{ item, index }">
      <span v-if="index < 2" class="sel-text">{{ index > 0 ? ", " : "" }}{{ item.title }}</span>
      <span v-if="index === 2" class="sel-more">&nbsp;(+{{ selected.length - 2 }})</span>
    </template>
  </v-select>
</template>

<style scoped>
.subcat-select {
  flex: 1 1 auto;
  min-width: 150px;
}
.sel-text { white-space: nowrap; }
.sel-more { white-space: nowrap; color: grey; font-size: 0.8em; align-self: center; }

/* match the native main-category select next to it */
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
