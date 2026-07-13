<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolledDown = ref(false);

// The actual scroller is the ".data-container" in datatable.vue (overflow-y: auto),
// not the window/body. Listen on and scroll that element instead.
let container: HTMLElement | null = null;

const onScroll = () => {
  if (!container) return;
  isScrolledDown.value = container.scrollTop > 20;
};

const scrollToTop = () => {
  container?.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  container = document.querySelector('.data-container');
  container?.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  container?.removeEventListener('scroll', onScroll);
});

</script>

<template>
  <!-- when the user scrolls down, this button appears to scroll back to the top -->
  <v-btn
    v-show="isScrolledDown"
    class="scroll-up-button"
    color="var(--color-anthrazit)"
    @click="scrollToTop"
    icon
    style="position: fixed; bottom:20px; width:50px; margin: 5% auto; left: 0; right: 0; z-index: 1000;  ">
    <v-icon>mdi-arrow-up</v-icon>
  </v-btn>

</template>

<style scoped>

</style>