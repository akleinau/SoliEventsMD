<script setup lang="ts">
import Category_menu from "./category_menu.vue";
import About_dialog from "./about_dialog.vue";
import Translation_dialog from "./translation_dialog.vue";
import { brandAssets } from '../constants/brandConfig.ts';
</script>

<template>
  <header class="header-container">
    <div class="header-top">
      <div class="title-container">        
        <img
            :src="brandAssets.bildmarke"
            class="logo"
            alt="Logo von Magdeburg teilt!: eine kantige Sprech-Blase mit einem senkrechten Strich in der Mitte; in der linken Hälfte eine Karotte auf hellem Grund und in der rechten Hälfte ein heller Schrauben-Schlüssel auf farbigem Grund"
        />
        <h2><router-link to="/">Magdeburg <b :style="{ color: brandAssets.color }">teilt!</b></router-link></h2>
      </div>

      <nav class="categories-container" aria-label="Kategorien">
        <Category_menu />
      </nav>

      <div class="dialog-container">
        <About_dialog 
            :isHeader="true" />
        <Translation_dialog />
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-container {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  background-color: var(--color-offwhite);
  padding: 10px;
  z-index: 100;
}

.header-top {
  display: grid;
  grid-template-columns: minmax(min-content, 1fr) auto minmax(min-content, 1fr);
  align-items: center;
  column-gap: 12px;
  width: 100%;
}

.title-container {
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
  margin: 0px;
  justify-content: left;
  align-items: center;
  padding: 0;
  color: var(--color-anthrazit);
  white-space: nowrap;
}

.logo {
  height: 3.2rem;
  min-height: 2.5rem;
  width: auto;
  flex: 0 0 auto;
}

.title-container h2 {
  margin: 0;
  font-size: 1.8rem;
  line-height: 1.15;
  font-weight: 700;
  text-align: left;
}

.categories-container {
  width: auto;
  margin: 0;
  grid-column: 2;
  justify-self: center;
  padding-left: 0;
}

.dialog-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  grid-column: 3;
  justify-self: end;
}

a {
  color: inherit;
  text-decoration: none;
}

/* zweite Zeile erst, wenn die Icon-Kategorien nicht mehr zwischen Titel und Icons passen (ca. 711px) */
@media (max-width: 767px) {
  .header-top {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "title dialog"
      "cats  cats";
    align-items: center;
    column-gap: 8px;
    row-gap: 4px;
  }

  .title-container {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .logo {
    height: 2.6rem;
  }

  .title-container h2 {
    font-size: 1.4rem;
    text-align: left;
  }

  .categories-container {
    grid-area: cats;
    width: 100%;
  }

  .dialog-container {
    grid-area: dialog;
    justify-self: end;
    width: auto;
  }
}
</style>
