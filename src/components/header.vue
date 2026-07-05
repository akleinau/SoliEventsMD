<script setup lang="ts">
import Category_menu from "./category_menu.vue";
import About_dialog from "./about_dialog.vue";
import Translation_dialog from "./translation_dialog.vue";
</script>

<template>
  <div class="header-container">
    <div class="header-top">
      <div class="title-container">
        <h2><router-link to="/alles">Magdeburg teilt!</router-link></h2>
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
  align-content: center;
  padding: 0;
  color: var(--color-green);
  grid-column: 1;
  justify-self: start;
  white-space: nowrap;
  padding-left: 25px;
}

.title-container h2 {
  margin: 0;
  font-size: 1.5rem;
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
    grid-area: title;
    justify-self: start;
    padding-left: 0;
  }

  .title-container h2 {
    font-size: 1.2rem;
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
