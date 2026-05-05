<script setup lang="ts">

import { useDataStore } from "../stores/dataStore.ts";
import Cards_view from "../components/cards_view.vue";
import List_view from "../components/list_view.vue";
import Scroll_up_button from "../components/scroll_up_button.vue";

const dataStore = useDataStore()

// Props
const props = defineProps<{
  viewMode: string;
}>();

const emit = defineEmits<{
  (e: 'itemgroup-clicked', itemgroup: any): void
}>()

const clicked = (itemgroup: any) => {
  dataStore.set_current_itemgroup(itemgroup)
  emit('itemgroup-clicked', itemgroup)
}

</script>

<template>
  <div class="data-container">

    <!-- Kachelansicht -->
    <div v-if="viewMode === 'cards'" class="cards-container d-flex flex-wrap pa-2" style="background: white">
      <Cards_view @itemgroup-clicked="clicked" />
    </div>

    <!-- Listenansicht (Tabelle) -->
    <div v-else class="list-container pa-2" style="background: white">
      <List_view @itemgroup-clicked="clicked" />
    </div>
      
      <Scroll_up_button />
    </div>
</template>

<style scoped>

.data-container {  
  position: relative;
  height: 100%;
  min-height: 0;
  overflow-y: auto; /* Scrollbar bei Bedarf */
}

.list-container, .cards-container {
  align-content: flex-start;
  justify-content: center;
}

</style>