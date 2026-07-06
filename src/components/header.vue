<script setup lang="ts">
import Category_menu from "./category_menu.vue";
import About_dialog from "./about_dialog.vue";
import Translation_dialog from "./translation_dialog.vue";
</script>

<template>
  <div class="header-container">
    <div class="header-top">
      <div class="title-container">        
        <v-img
            src="src/assets/logo/Bildmarke_mit_Outlines_grün.svg"
            class="logo"
            height="60"
            min-height="40"
        />
        <h2><router-link to="/alles">Magdeburg <b style="color: var(--color-green)">teilt!</b></router-link></h2>
      </div>

      <div class="categories-container">
        <Category_menu />
      </div>

      <div class="dialog-container">
        <About_dialog />
        <Translation_dialog />
      </div>
    </div>
  </div>
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
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  column-gap: 12px;
  width: 100%;
}

.title-container {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 8fr);
  gap: 10px;
  margin: 0px;
  justify-content: left;
  align-items: center;
  padding: 0;
  color: var(--color-anthrazit);
  white-space: nowrap;
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
    grid-template-columns: minmax(0, 1fr) minmax(0, 4fr);
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
