<script setup lang="ts">

import Data_loader from "../components/data_loader.vue";
import Datatable from "../components/datatable.vue";
import Initial_selection from "../components/initial_selection.vue";
import Curr_item_dialog from "../components/curr_item_dialog.vue";

const reduced_columns = ['Was', 'Wer', 'Wo', 'Uhrzeit', 'Wochentag']

import { useDataStore } from "../stores/dataStore.ts";
import Filter_menu from "../components/curr_item_dialog.vue";
import Scroll_up_button from "../components/scroll_up_button.vue";

const dataStore = useDataStore()

</script>

<template>
    <div>HOME</div>
    <data_loader />
    <initial_selection class="mt-5" />
    <filter_menu/>
    <curr_item_dialog class="mt-5" v-if="dataStore.current_item !== null" />
    <datatable :headers="reduced_columns"/>
    <scroll_up_button />

</template>

<style scoped>

</style>
