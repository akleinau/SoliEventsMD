<script setup lang="ts">

const links = [
  { text: 'Start', url: '/', icon: 'mdi-home' },
  { text: 'Feedback', url: '/kontakt', icon: 'mdi-email' },
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

            <div class="footer-credit">
                {{ new Date().getFullYear() }} — <strong>ein Projekt von Sharing in Magdeburg</strong>
            </div>
        </div>

    </div>

</template>

<style scoped>

    .myfooter {
        display: grid;
        gap: 5px;
        padding: 5px 10px;
        border-top: 1px var(--color-text-muted) dotted;
        text-align: center;
    }

    .disclaimer,
    .footer-credit {
        color: var(--color-anthrazit);
        opacity: 1;
    }

    /* umbricht, statt die Links übereinander zu schieben */
    .footer_buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        align-items: center;
        justify-content: center;
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
            --v-btn-height: 28px;
            padding: 0 6px;
            margin: 0px;
            font-size: 0.7rem;
            letter-spacing: 0;
        }

        a.v-btn :deep(.v-icon) {
            font-size: 16px;
            margin-right: 4px !important;
        }

        .footer_buttons {
            gap: 2px;
        }

        .footer-credit {
            font-size: 0.75rem;
        }
    }

</style>

