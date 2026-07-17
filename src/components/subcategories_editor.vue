<!-- TimeslotEditor.vue -->
<script setup>
import { computed } from 'vue'
import { useDataStore } from "../stores/dataStore.ts";
import VueMultiselect from 'vue-multiselect'
import { SUB_CATEGORIES } from "../constants/categoryConfig";

const dataStore = useDataStore()

const props = defineProps({
  editableItemGroup: { type: Object, required: true }
})

</script>

<template>
  <div class="row3-container">
    <!--span style="color: grey;">Unterkategorie: </span-->
    <select multiple v-model="editableItemGroup.Unterkategorie">
      <option v-for="option in SUB_CATEGORIES" :value="option.path" :placeholder="editableItemGroup.Unterkategorie">
        {{ option.label }}
      </option>
    </select>
    <v-tooltip :text="dataStore.getSubCategoryName(editableItemGroup.Unterkategorie ?? '')" location="top" open-on-click>
      <template v-slot:activator="{ props }">
          <img v-if="dataStore.getSubCategorySvg(editableItemGroup.Unterkategorie) != ''" v-bind="props" class="dialog-title__icon" color="#3b3b3b" :src="dataStore.getSubCategorySvg(editableItemGroup.Unterkategorie)"/>
          <v-icon v-else v-bind="props" size="x-large" color="black" class="dialog-title__icon">{{ dataStore.getSubCategoryIcon(editableItemGroup.Unterkategorie) }}</v-icon>
      </template>
    </v-tooltip>
  </div>
</template>

<style>

.row3-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex-direction: row;
  flex: 1 1 0;
  column-gap: 5px;
  align-items: center;
}

.dialog-title__icon {
  width: 40px;
  height: 40px;
  flex-shrink: 1;
  opacity: 0.85;
}

input {
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


/* Mobile-Ansicht ToDo: fix code or this section -> use "@media ..."" OR use "".XYZ--mobile" ! */
@media (max-width: 767px) {

  .row3-container {
    display: flex;
    flex-wrap: wrap;
  }

  input, textarea {
    display: inline-block;
    width: 100%;
    max-width: 100%;
  }
}
</style>