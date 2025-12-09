<script setup lang="ts">

/*import { ref } from 'vue';

const visible = ref(true)

const links = [
  { text: 'Kontaktformular', url: '/kontakt', icon: 'mdi-email' },
  { text: 'Impressum', url: '/impressum', icon: 'mdi-information' },
  { text: 'Datenschutzerklärung', url: '/datenschutz', icon: 'mdi-shield-lock' },
  { text: 'Link SiC', url: 'https://t.me/sharinginmagdeburg', icon: 'mdi-open-in-new' }
];*/

</script>

<template>
    <div class="sticky-header text-center " style="color: #ec4d0b">
      <h1><router-link to="/home">Magdeburg teilt!</router-link></h1>
    </div>
    <!--CHeader>
        <CContainer fluid>
            <CHeaderBrand href="#">Header</CHeaderBrand>
            <CHeaderToggler @click="visible = !visible" />
            <CCollapse class="header-collapse" :visible="visible">
                <CHeaderNav>
                <CNavItem>
                    <CNavLink href="#" active>
                    Home
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href="#">Link</CNavLink>
                </CNavItem>
                <CDropdown togglerText="Dropdown" variant="nav-item">
                    <CDropdownItem href="#">Action</CDropdownItem>
                    <CDropdownItem href="#">Another action</CDropdownItem>
                    <CDropdownItem href="#">Something else here</CDropdownItem>
                </CDropdown>
                <CNavItem>
                    <CNavLink href="#" disabled>
                    Disabled
                    </CNavLink>
                </CNavItem>
                </CHeaderNav>
            </CCollapse>
        </CContainer>
    </CHeader>

        <v-btn
            v-for="link in links"
            :key="link.text"
            variant="text"
            rounded
            :to="link.url.startsWith('http') ? undefined : link.url"
            :href="link.url.startsWith('http') ? link.url : undefined"
            :target="link.url.startsWith('http') ? '_blank' : undefined"
            color="primary"
            class="ma-1"
        >
            <v-icon left class="mr-2">{{ link.icon }}</v-icon> {{ link.text }}
        </v-btn>

        <v-divider class="my-2" thickness="2" width="50"></v-divider-->

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


