<script setup lang="ts">

  import Category_menu from "../components/category_menu.vue";

</script>

<template>
    <div class="header-container text-center">

      <div class="title-container">
        <h1><router-link to="/alles">Magdeburg teilt!</router-link></h1>
      </div>

      <div class="categories-container mb-3 mt-3">
        <Category_menu />
      </div>

      <div class="space-container"></div>

    </div>

</template>

<style scoped>

  .header-container {
      display: flex;
      position: sticky;
      top: 0; /* Klebt am oberen Rand */      
      background-color: white;
      padding: 10px;
      z-index: 100; /* Stellt sicher, dass der Header über anderen Elementen liegt */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Optional: Schatten für bessere Sichtbarkeit */
  }

  .title-container, .space-container {
      align-content: center;
      padding: 0 10px;
      flex: 2;
      color: #ec4d0b;
  }

  .categories-container {
      align-self: top;
      flex: 5;
      justify-content: space-between;
  }

  a {
      color: inherit;
  }

  /* Desktop-Ansicht */
  @media (min-width: 768px) {
      .header-container {
          flex-direction: row;
      }
  }

  /* Mobile-Ansicht ToDo: fix code or this section -> use "@media ..."" OR use "".XYZ--mobile" ! */
  @media (max-width: 767px) {
      .header-container {
          flex-direction: column;
      }
  }

</style>


