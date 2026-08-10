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
        <div class="start-picture pattern-background">
        </div>
    </div>

</template>

<style scoped>

.start-container {
    display: flex;
    flex-direction: row;
    padding: 60px 80px;
    gap: 50px;
    flex: 1;
    height: calc(100dvh - 160px);
    align-items: center;
}

.start-text {
    flex: 1 1 0;
}

.start-picture {
    flex: 1;                 /* Nimmt alle verbleibende Breite */
    min-height: 100%;        /* Füllt die komplette Container-Höhe */
    border-radius: 8px;      /* Optional: abgerundete Ecken */
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
    background-repeat: repeat;
    background-size: contain;    
}

</style>


