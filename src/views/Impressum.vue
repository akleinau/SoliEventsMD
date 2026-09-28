<script setup lang="ts">
import { siteConfig } from '../constants/siteConfig.ts';

</script>

<template>

    <div class="mx-5">
        <h1>IMPRESSUM</h1>
        <div>
            {{ siteConfig.legal.name }}<br>
            <template v-for="line in siteConfig.legal.addressLines" :key="line">{{ line }}<br></template>
        </div>
    </div>

</template>

<style scoped>

.impressum-container {
  height: 100%;
}

</style>


