<script setup lang="ts">

import Header from "./components/header.vue";
import Footer from "./components/footer.vue";

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

</style>
