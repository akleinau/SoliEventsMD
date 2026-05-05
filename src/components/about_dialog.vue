<script setup lang="ts">

</script>

<template>
    <v-dialog max-width="800">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
                v-bind="activatorProps"
                color="surface-variant"
                density="comfortable"
                icon="mdi-information-variant"
                variant="outlined"
            >
            </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card class="card" title="Die Idee ">
                <template v-slot:prepend>
                    <v-icon size="x-large" color="ec4d0b"> mdi-information-variant </v-icon>
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
                    <h3>Warum gibt es die Seite?</h3>
                    <p>Auf "magdeburg-teilt.de" geht es darum, Dinge in Magdeburg miteinander zu teilen. 
                        Diese Seite bietet dir eine Übersicht über solidarische Angebote in der Stadt Magdeburg und der Umgebung.</p>
                    <p>Die Angebote kannst du nutzen, wenn du etwas kostenlos brauchst (oder für nur wenig Geld). 
                        Oder wenn du etwas teilen oder verschenken willst. Oder um etwas auszuleihen.</p>
                    <p>Es gibt zum Beispiel Angebote für Essen, für Kleidung, für Bücher, für Räume, für Werkzeug und vieles andere.</p>
                    <br>
                    <h3>Und wie funktioniert es?</h3>
                    <p>Mit den <b>Filtern</b> kannst du die Übersicht nach deinen Wünschen anpassen und zum Beispiel nach bestimmten Tagen suchen.</p>
                    <p>Auf der <b>Karte</b> siehst du, wo genau die Angebote in Magdeburg sind.</p>
                    <p>Wenn du zu einem <b>Angebot</b> noch mehr wissen willst, klicke auf den Eintrag.</p>
                    <p>Du kannst <b>Einträge verbessern</b>, wenn du einen Fehler siehst. Klicke dafür auf „Bearbeiten“, wenn du einen Eintrag geöffnet hast.</p>
                    <p>Oder du kannst ein neues <b>Angebot hinzufügen</b>, wenn es dazu noch keinen Eintrag in der Übersicht gibt. Nutze dafür den Muster-Eintrag ganz unten.</p>
                    <p>Die Übersicht wird besser, wenn wir alle sie pflegen.</p>
                    <br>
                    <h3>Hinweis</h3>
                    <p>Bitte beachte: Viele Angebote sind an Feiertagen geschlossen!</p>
                    <br>
                    <p>Wenn du eine Frage hast, kannst du eine E-Mail schreiben an: <a href="mailto:kontakt@magdeburg-teilt.de">kontakt@magdeburg-teilt.de</a>
                    Oder nutze das <router-link to="/kontakt" @click="isActive.value = false">Kontaktformular</router-link>.</p>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>

</template>

<style scoped>

.v-card-title {
  white-space: wrap !important;
  overflow: visible !important;
  height: auto !important;
}

</style>


