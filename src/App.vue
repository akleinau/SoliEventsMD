<script setup lang="ts">

import Header from "./components/header.vue";
import Footer from "./components/footer.vue";

</script>

<template>
  <v-app>
    <Header></Header>
    <v-main>
      <router-view /> <!-- Hier wird die aktuelle Route eingebunden -->
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<style scoped>

</style>
