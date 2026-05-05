<script setup lang="ts">

</script>

<template>
    <v-dialog max-width="800">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                color="surface-variant"
                density="comfortable"
                icon="mdi-translate"
                variant="outlined"
            >
            </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Language">
                <template v-slot:prepend>
                    <v-icon size="x-large" color="ec4d0b"> mdi-translate </v-icon>
                </template>
                <template v-slot:append>
                    <v-btn
                    color="grey"
                    text="X"
                    variant="flat"
                    @click="isActive.value = false"
                    ></v-btn>
                </template>
                <v-card-text>
                    <p>This website is only available in German at the moment. We do not have the resources to provide it in any other language. Please use the translation tool of your internet browser instead.</p>
                    <br>
                    <p>Diese Seite gibt es gerade nur auf Deutsch. Wir können sie leider nicht in einer anderen Sprache anbieten. Bitte nutze dafür die Funktion zum Übersetzen in deinem Internet-Browser.</p>
                    <br>
                    <p><b>Information on how to translate in different browsers:</b>
                        <br>
                        <a href="https://www.online-tech-tips.com/how-to-translate-a-web-page-in-most-any-browser/" target="_blank">https://www.online-tech-tips.com/how-to-translate-a-web-page-in-most-any-browser/</a></p>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>

</template>

<style scoped>

</style>


