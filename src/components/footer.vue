<script setup lang="ts">

const links = [
  { text: 'Home', url: '/home', icon: 'mdi-home' },
  { text: 'Kontaktformular', url: '/kontakt', icon: 'mdi-email' },
  { text: 'Impressum', url: '/impressum', icon: 'mdi-information' },
  { text: 'Datenschutz', url: '/datenschutz', icon: 'mdi-shield-lock' },
  { text: 'Sharing in Magdeburg (Telegram)', url: 'https://t.me/sharinginmagdeburg', icon: 'mdi-open-in-new' }
];

</script>

<template>
    <div class="myfooter">

        <div class="text-caption font-weight-regular disclaimer">
            Disclaimer: Die auf dieser Website bereitgestellten Informationen und Daten wurden mit größter Sorgfalt zusammengestellt. Dennoch übernehmen wir keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der Angaben.
        </div>

        <v-divider></v-divider>

        <div class="footer_buttons">
            <v-btn
                v-for="link in links"
                :key="link.text"
                variant="text"
                rounded
                :to="link.url.startsWith('http') ? undefined : link.url"
                :href="link.url.startsWith('http') ? link.url : undefined"
                :target="link.url.startsWith('http') ? '_blank' : undefined"
            >
                <v-icon left class="mr-2" aria-hidden="true">{{ link.icon }}</v-icon> {{ link.text }}<span
                    v-if="link.url.startsWith('http')" class="visually-hidden"> (öffnet in neuem Fenster)</span>
            </v-btn>

            <div class="footer-credit" style="text-align: end;">
                {{ new Date().getFullYear() }} — <strong>ein Projekt von Sharing in Magdeburg</strong>
            </div>
        </div>

    </div>

</template>

<style scoped>

    .myfooter {
        display: grid;
        align-content: center;
        justify-content: center;
        gap: 5px;
        padding: 5px;
        border-top: 1px var(--color-text-muted) dotted;
        max-height: 80px;
    }

    .disclaimer,
    .footer-credit {
        color: var(--color-anthrazit);
        opacity: 1;
    }

    .footer_buttons {
        display: grid;
        grid-template-columns: repeat(6, auto);
        gap: 5px;
        align-items: center;
        justify-items: center;
        margin: 1px;
    }

    a {
        color: inherit;
    }

    /* Mobile-Ansicht: Footer kompakter packen */
    @media (max-width: 767px) {
        .myfooter {
            padding-top: 4px;
            padding-bottom: 4px;
            row-gap: 4px;
        }

        a.v-btn {
            padding: 0px;
            margin: 0px;
        }
    }

</style>


