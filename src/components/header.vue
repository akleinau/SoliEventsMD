<script setup lang="ts">

</script>

<template>
    <div class="sticky-header text-center " style="color: #ec4d0b">
      <h1><router-link to="/home">Magdeburg teilt!</router-link></h1>
    </div>

</template>

<style scoped>

    .sticky-header {
        position: sticky;
        top: 0; /* Klebt am oberen Rand */
        background-color: #f1f1f1;
        padding: 10px;
        z-index: 100; /* Stellt sicher, dass der Header über anderen Elementen liegt */
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Optional: Schatten für bessere Sichtbarkeit */
    }

</style>


