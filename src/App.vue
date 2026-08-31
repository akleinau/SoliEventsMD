<script setup lang="ts">

import { onBeforeUnmount, onMounted } from "vue";
import Header from "./components/header.vue";
import Footer from "./components/footer.vue";
import { useDataStore } from "./stores/dataStore.ts";

const dataStore = useDataStore();

// app-weit, damit auch Seiten ohne Home.vue (z.B. Start) die mobile Ansicht kennen
onMounted(() => {
  dataStore.checkIfMobile();
  window.addEventListener('resize', dataStore.checkIfMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', dataStore.checkIfMobile);
});

</script>

<template>
  <v-app class="app-container">
    <Header></Header>
    <v-main class="main-container">
      <router-view /> <!-- Hier wird die aktuelle Route eingebunden -->
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<style scoped>

/* Basis-Styles für das Layout */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--color-offwhite);
}

.main-container {
  flex: 1 1 0;
  overflow-y: auto;
}

/* Mobil: die Seite selbst scrollt, der Footer steht erst am Seitenende */
@media (max-width: 767px) {
  .main-container {
    flex: 1 0 auto;
    overflow-y: visible;
  }
}

</style>
