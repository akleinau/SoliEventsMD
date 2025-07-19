<script setup lang="ts">
import { ref } from 'vue';

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

let isScrolledDown = ref(false);

window.onscroll = () => {
  // This will trigger the reactivity system to update the button visibility
  isScrolledDown.value = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20
};

</script>

<template>
  <!-- when the user scrolls down, this button appears to scroll back to the top -->
  <v-btn
    v-show="isScrolledDown"
    class="scroll-up-button"
    color="#ec4d0b"
    @click="scrollToTop"
    icon
    style="position: fixed; bottom:20px; width:50px; margin: 5% auto; left: 0; right: 0; z-index: 1000;  ">
    <v-icon>mdi-arrow-up</v-icon>
  </v-btn>

</template>

<style scoped>

</style>