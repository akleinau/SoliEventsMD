<script setup lang="ts">

  import Category_menu from "../components/category_menu.vue";

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
      </div>
    </div>

</template>

<style scoped>

  .header-container {
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0; /* Klebt am oberen Rand */      
      background-color: white;
      padding: 10px;
      z-index: 100; /* Stellt sicher, dass der Header über anderen Elementen liegt */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Optional: Schatten für bessere Sichtbarkeit */
  }

  .header-top {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      align-items: center;
      column-gap: 12px;
      width: 100%;
  }

    .header-top::after {
      content: "";
    }

  .title-container {
      align-content: center;
      padding: 0;
      color: #ec4d0b;
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

  a {
      color: inherit;
      text-decoration: none;
  }

  /* Desktop-Ansicht */
  @media (min-width: 768px) {
      .header-container {
          flex-direction: column;
      }
  }

  /* Mobile-Ansicht ToDo: fix code or this section -> use "@media ..."" OR use "".XYZ--mobile" ! */
  @media (max-width: 767px) {
      .header-top {
        display: flex;
        flex-direction: column;
        align-items: stretch;
          gap: 4px;
      }

      .categories-container {
        width: 100%;
      }

      .title-container h2 {
          font-size: 1.2rem;
      }
  }

</style>


