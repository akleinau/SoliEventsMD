<script setup lang="ts">

  import Category_menu from "../components/category_menu.vue";
  import Filter_menu from "../components/filter_menu.vue";

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

        <div class="controls-container">
          <Filter_menu />
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
      grid-template-columns: auto 1fr auto;
      align-items: center;
      column-gap: 12px;
      width: 100%;
  }

  .title-container {
      align-content: center;
      padding: 0;
      color: #ec4d0b;
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
      width: 100%;
      margin: 0;
      justify-self: center;
      padding-left: 0;
  }

  .controls-container {
      justify-self: end;
      width: min(100%, 620px);
      min-width: 420px;
      padding-right: 6px;
    }

    .controls-container :deep(.control-bar) {
      background: transparent !important;
      padding: 0;
    }

  .controls-container :deep(.control-bar__row) {
      justify-content: flex-end;
  }

  .controls-container :deep(.control-bar__search) {
      flex: 0 1 200px;
      max-width: 220px;
      min-width: 130px;
  }

    .controls-container :deep(.control-bar__view-toggle) {
      margin-left: 0;
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
          align-items: flex-start;
          gap: 4px;
      }

      .title-container h2 {
          font-size: 1.2rem;
      }

      .controls-container {
          width: 100%;
          min-width: 0;
      }
  }

</style>


