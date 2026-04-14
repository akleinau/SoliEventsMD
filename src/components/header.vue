<script setup lang="ts">

  import Category_menu from "./category_menu.vue";
  import About_dialog from "./about_dialog.vue";
  import Translation_dialog from "./translation_dialog.vue";

</script>

<template>
    <div class="header-container text-center">

      <div class="title-container">
        <h1><router-link to="/alles">Magdeburg teilt!</router-link></h1>
      </div>

      <div class="row-container">
        <div class="categories-container mb-2 mt-2">
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
      display: grid;
      grid-template-columns: auto 100fr auto;
      position: sticky;
      top: 0; /* Klebt am oberen Rand */      
      background-color: white;
      padding: 10px;
      z-index: 100; /* Stellt sicher, dass der Header über anderen Elementen liegt */
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Optional: Schatten für bessere Sichtbarkeit */
  }

  .title-container {
    align-content: center;
    justify-self: start;
    color: #ec4d0b;
    flex: 1;
  }

  .row-container{
    display: flex;
    flex: 5;
  }

  .categories-container {
    align-self: top;
    flex: 5;
    align-content: center;
    justify-content: space-between;
    margin-left: 20px;
    margin-right: 20px;
  }

  .dialog-container {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 5px;
    flex: 1;
    align-content: center;
    color: #ec4d0b;
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
        grid-template-columns: auto;
        grid-template-rows: 1fr 1fr;
        justify-content: center;
      }

      .title-container {
        justify-self: center;
      }

      .categories-container {
        margin-left: 0px;
        margin-right: 0px;
      }

      .row-container {
        grid-template-columns: 1fr auto;
        gap: 12px;
      }
  }

</style>


