<script setup lang="ts">
import { siteConfig } from '../constants/siteConfig.ts';

</script>

<template>

    <div class="myclass mx-5 justify-center">
        <h1>KONTAKT</h1>
        <div>
            Schreib uns über das folgende Formular. (Bitte warte kurz, falls es dir nicht direkt angezeigt wird.)
            <br>
            ...oder an {{ siteConfig.email.contact }}        
        </div>

        <iframe class="myframe" :title="`Kontakt-Formular von ${siteConfig.organizer.name}`" :src="siteConfig.feedbackFormUrl"></iframe>
    </div>

</template>

<style scoped>

.myclass {
    height: 65vh;
}

.myframe {
    width: 100%;
    height: 100%;
}

</style>


