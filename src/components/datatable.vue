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
  (e: 'item-clicked', item: any): void
}>()

const clicked = (item: any) => {
  dataStore.set_current_item(item)
  emit('item-clicked', item)
}

</script>

<template>
  <div class="data-container">

    <!-- Kachelansicht -->
    <div v-if="viewMode === 'cards'" class="cards-container d-flex flex-wrap pa-2" style="background: white">
      <Cards_view />
    </div>

    <!-- Listenansicht (Tabelle) -->
    <div v-else class="list-container pa-2" style="background: white">
      <List_view />
    </div>
      
      <Scroll_up_button />
    </div>
</template>

<style scoped>

.data-container {  
  position: relative;
  height: 100vh;
  overflow-y: auto; /* Scrollbar bei Bedarf */
}

.list-container, .cards-container {
  align-content: flex-start;
  justify-content: center;
}

</style>