<script setup lang="ts">

const links = [
  { text: 'Home', url: '/home', icon: 'mdi-home' },
  { text: 'Kontaktformular', url: '/kontakt', icon: 'mdi-email' },
  { text: 'Impressum', url: '/impressum', icon: 'mdi-information' },
  { text: 'Datenschutzerklärung', url: '/datenschutz', icon: 'mdi-shield-lock' },
  { text: 'Sharing in Magdeburg (Telegram)', url: 'https://t.me/sharinginmagdeburg', icon: 'mdi-open-in-new' }
];

</script>

<template>
    <v-footer class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3 myfooter" color="surface-light">

        <div class="text-caption font-weight-regular opacity-60">
            Disclaimer: Die auf dieser Website bereitgestellten Informationen und Daten wurden mit größter Sorgfalt zusammengestellt. Dennoch übernehmen wir keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der Angaben.
        </div>

        <v-divider></v-divider>

        <v-btn
            v-for="link in links"
            :key="link.text"
            variant="text"
            rounded
            :to="link.url.startsWith('http') ? undefined : link.url"
            :href="link.url.startsWith('http') ? link.url : undefined"
            :target="link.url.startsWith('http') ? '_blank' : undefined"
            class="ma-1"
        >
            <v-icon left class="mr-2">{{ link.icon }}</v-icon> {{ link.text }}
        </v-btn>

        <div class="ma-2" style="color: #ec4d0b; text-align: end;">
            {{ new Date().getFullYear() }} — <strong>ein Projekt von Sharing in Magdeburg</strong>
        </div>

    </v-footer>

</template>

<style scoped>

    .myfooter {
        max-height: 100px;
    }


    a {
        color: inherit;
    }

</style>


