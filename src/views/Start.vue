<script setup lang="ts">
import About_dialog from "../components/about_dialog.vue"

const buttonLabel = "Was genau ist 'Magdeburg teilt!' ?"

</script>

<template>
    <div class="start-container">
        <div class="start-text">
            <h1>
                Teilen<br>
                verbindet<br>
                Magdeburg<br>
            </h1>
            <br>
            <h3>
                Hier findest du lokale Angebote und Ressourcen.<br>
                Von Essensausgaben und Umsonstläden <br>bis zu Büchertauschorten und Werkstätten ist alles dabei.
            </h3>
            <br>
            <v-btn class="start-button" size="x-large" to="/alles">
                Angebote entdecken
            </v-btn>
            <br>
            <br>
            <div class="start-info">
                <About_dialog
                    :isHeader="false"
                    :buttonLabel="buttonLabel" /> <span></span>
            </div>
        </div>
        <div class="start-picture">
            <div class="pattern-background">
            </div>
        </div>
    </div>

</template>

<style scoped>

.start-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 60px 80px;
    gap: 50px;
    min-height: 100%;      /* füllt den Bereich zwischen Kopf- und Fußzeile */
    align-items: center;   /* Text vertikal mittig */
}

.start-text {
    flex: 1 1 380px;
    min-width: 0;
}

.start-picture {
    display: flex;
    flex: 1 1 380px;
    align-self: stretch;   /* Bild über die volle Höhe */
    min-height: 200px;     /* nur wirksam, wenn Bild und Text untereinander stehen */
}

.start-button {
    color: var(--color-offwhite);
    background-color: var(--color-green);
    font-weight: bold;
}

.start-info {
    display: flex;
    align-items: center;
    gap: 5px;
}

.pattern-background {
    background-image: url("/src/assets/pattern/Muster_Endlos_Kachel.svg");
    background-repeat: repeat;   /* Endlos-Kachel: wiederholen statt eine Kachel aufblasen */
    background-size: 427px;      /* gleiche Kachelgröße wie im Datenbereich */
    flex: 1;
    border-radius: 8px;
}

@media (max-width: 767px) {
    .start-container {
        padding: 40px 25px;
        gap: 20px;
    }

    .start-picture {
        min-height: 180px;
    }

    .pattern-background {
        background-size: 152px;   /* kleinere Kachel: mehr vom Muster sichtbar */
    }
}

</style>
