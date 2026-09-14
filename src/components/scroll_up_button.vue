<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useDataStore } from '../stores/dataStore.ts';

const dataStore = useDataStore();

const isScrolledDown = ref(false);
const bottomOffset = ref(20);
let container: HTMLElement | null = null;

const onScroll = () => {
  isScrolledDown.value = window.scrollY > 20 || (container?.scrollTop ?? 0) > 20;

  // never overlap the footer or (mobile) the "Karte öffnen" button: sit 12px above the higher one
  const selectors = dataStore.isMobile ? ['.myfooter', '.toggle-map-button'] : ['.myfooter'];
  const tops = selectors
    .map(s => document.querySelector(s)?.getBoundingClientRect().top ?? window.innerHeight);
  bottomOffset.value = Math.max(20, window.innerHeight - Math.min(window.innerHeight, ...tops) + 12);
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  container?.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  container = document.querySelector('.data-container');
  container?.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
});

onUnmounted(() => {
  container?.removeEventListener('scroll', onScroll);
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
});

</script>

<template>
  <!-- when the user scrolls down, this button appears to scroll back to the top -->
  <v-btn
    v-show="isScrolledDown"
    class="scroll-up-button"
    color="var(--color-anthrazit)"
    aria-label="Zum Seiten-Anfang springen"
    title="Zum Seiten-Anfang springen"
    @click="scrollToTop"
    icon
    :style="{ position: 'fixed', bottom: bottomOffset + 'px', width: '50px', margin: '0 auto', left: 0, right: 0, zIndex: 1000 }">
    <v-icon class="scroll-up-button__icon">mdi-arrow-up</v-icon>
  </v-btn>

</template>

<style scoped>

.scroll-up-button__icon {
  color: var(--color-offwhite);
}

</style>
