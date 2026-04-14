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
                    <p>We currently do not have the resources to provide this website in a language other than German. Feel free to use the translation tool of your browser to translate the website.</p>
                    <br>
                    <p>Wir können diese Website gerade leider nicht auf einer anderen Sprache als Deutsch bereitstellen. Bitte nutze die Übersetzungsfunktion von deinem Browser, falls du eine andere Sprache benötigst.</p>
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


