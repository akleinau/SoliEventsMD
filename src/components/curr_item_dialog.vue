<script setup lang="ts">

import { computed, onMounted, ref, watch } from "vue";
import { useDataStore } from "../stores/dataStore.ts";
import { MAIN_CATEGORIES } from "../constants/categoryConfig";

const dataStore = useDataStore()

const active = ref(true);

type DataRow = Record<string, string | undefined>;
const editableItem = ref(null as DataRow | null);
const copyEditInfos = ref(null as String | null);
const isEditing = ref(false);


onMounted(() => {
  active.value = true;
  editableItem.value = JSON.parse(JSON.stringify(dataStore.current_item));
  
})

watch(() => active.value, (newValue) => {
  if (!newValue) {
    dataStore.current_item = null;
    dataStore.clear_focused_item();
  }
})

const item = computed(() => dataStore.current_item)

const isMobile = computed(() => dataStore.isMobile)

const isVerificationStale = computed(() => {
  if (!item.value) {
    return false;
  }
  return dataStore.shouldShowVerificationWarning(item.value);
});

const verificationLabel = computed(() => {
  if (!item.value) {
    return null;
  }
  return dataStore.getVerificationLabel(item.value.Letzte_Ueberpruefung);
});

const verificationWarning = computed(() => {
  if (!item.value) {
    return null;
  }
  return dataStore.getVerificationWarning(item.value.Letzte_Ueberpruefung);
});


const isVerificationStaleEditing = computed(() => {
  if (!editableItem.value) {
    return false;
  }
  return dataStore.shouldShowVerificationWarning(editableItem.value);
});

const verificationLabelEditing = computed(() => {
  if (!editableItem.value) {
    return null;
  }
  return dataStore.getVerificationLabel(editableItem.value.Letzte_Ueberpruefung);
});

const verificationWarningEditing = computed(() => {
  if (!editableItem.value) {
    return null;
  }
  return dataStore.getVerificationWarning(editableItem.value.Letzte_Ueberpruefung);
});

// Werbegrafik image handling
const werbegrafikPath = computed(() => {
  return dataStore.getWerbegrafikPath(item.value);
});

const werbegrafikError = ref(false);

// Reset error state when item changes
watch(() => item.value, () => {
  werbegrafikError.value = false;
});

const handleWerbegrafikError = () => {
  werbegrafikError.value = true;
};

const showWerbegrafik = computed(() => {
  return werbegrafikPath.value && !werbegrafikError.value;
});

const openMailTo = (content: string) => {  
  // E-Mail-Adresse und Betreff festlegen
  const email = "aenderung@magdeburg-teilt.de";
  const subject = "Vorschlag für Soli-Angebot";
  const body = content;

  // mailto-Link konstruieren
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Link im neuen Tab öffnen
  window.open(mailtoLink, "_blank");
};

const closeDialog = () => {
  active.value = false;
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  //editableItem.value = dataStore.current_item;
  editableItem.value = JSON.parse(JSON.stringify(dataStore.current_item));
};
const cancelEdit = () => {
  copyEditInfos.value = null;
  isEditing.value = false;
};

const getFormattedDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0'); // Tag (DD)
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Monat (MM, +1 weil Monate 0-indexiert sind)
  const year = today.getFullYear(); // Jahr (YYYY)
  return `${day}.${month}.${year}`;
}

const saveEdit = () => {
  if (editableItem.value)
  editableItem.value.Letzte_Ueberpruefung = getFormattedDate().toString();
  const content = JSON.stringify(editableItem.value);
  const content_old = JSON.stringify(item.value);
  copyEditInfos.value = "Hallo,\n\nich möchte folgende Veränderung eines Soli-Angebots melden.\n\nLiebe Grüße,\nDEIN_NAME" + "\n\nNEU:\n\n" + content + "\n\nALT:\n\n" + content_old;
  openMailTo(copyEditInfos.value.toString());
};

const copied = ref(false);

const copyToClipboard = async() => {
  if (copyEditInfos.value != null) {
    const copytext = copyEditInfos.value.toString();
    try {
      await navigator.clipboard.writeText(copytext);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000); // Rücksetzen nach 2 Sekunden
    } catch (err) {
      console.error("Fehler beim Kopieren:", err);
      alert("Kopieren fehlgeschlagen. Bitte manuell kopieren: " + copyEditInfos.toString());
    }
  }
}

</script>

<template>
  <v-dialog 
    v-model="active" 
    class="dialog-container" 
    :attach="'.datatable-wrapper'" 
    :contained="true" 
    :scrim="false"
    :persistent="true"
    :no-click-animation="true"
    content-class="dialog-content-shifted"
  >
    <!-- Anzeigemodus (View) -->
    <v-card v-if="item && !isEditing">
      <v-card-title class="dialog-title">
        {{ item.Was }}
        <v-icon size="x-large" color="black" class="dialog-title__icon">{{ dataStore.getCategoryIcon(item.Kategorie) }}</v-icon>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" :md="showWerbegrafik ? 7 : 12">
            <p class="mb-3 text-subtitle-1 text-medium-emphasis">{{ item.Wer }}</p>
            <p class="mb-1 col-container"> <v-icon>mdi-map-marker</v-icon> <div>{{ item.Wo }}</div></p>
            <p class="mb-1 col-container"> <v-icon>mdi-calendar</v-icon> <div>{{ dataStore.getFormattedDay(item.Wochentag ?? '') }}, {{ item.Rhythmus }}</div></p>
            <p class="mb-1 col-container"> <v-icon>mdi-clock</v-icon> <div>{{ item.Uhrzeit_Start }} - {{ item.Uhrzeit_Ende }}</div></p>
            <p class="mt-5"> <a :href="item.Link" target="_blank">{{ item.Link }}</a> </p>
          </v-col>

          <v-col v-if="showWerbegrafik" cols="12" md="5">
            <v-img
                :src="werbegrafikPath!"
                class="werbegrafik-image"
                max-height="300"
                contain
                @error="handleWerbegrafikError"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
        </v-row>

        <v-row class="edit-info-container">
          <p
              v-if="!isVerificationStale"
              class="text-grey-darken-1"
          >
            Letzte Überprüfung: {{ verificationLabel ?? 'keine Angabe' }}
          </p>
          <v-alert class="px-2 py-2"
              v-else
              type="warning"
              variant="tonal"
              density="comfortable"
          >
            {{ verificationWarning ?? 'Achtung!' }}
          </v-alert>
          
          <v-btn size="small" @click="toggleEdit">Bearbeiten</v-btn>   
          <v-btn size="small" @click="closeDialog">Schließen</v-btn>        
          
        </v-row>

      </v-card-text>
    </v-card>
    
    
    <!-- Bearbeitungsmodus (Edit) -->
    <v-card v-if="editableItem && isEditing">
      <v-card-title class="dialog-title">
        <v-col class="pb-0">
          <v-row>
            <textarea v-model="editableItem.Was" placeholder="Was" type="text" :rows="isMobile ? '2' : '1'" />
          </v-row>
          <v-card-text class="pb-0">
            <v-row class="align-center justify-end">
              <span>Kategorie: 
                <select v-model="editableItem.Kategorie">
                  <option v-for="option in MAIN_CATEGORIES" :value="option.path" :placeholder="editableItem.Kategorie">
                    {{ option.label }}
                  </option>
                </select>
              </span>
            <v-icon size="x-large" color="black" class="dialog-title__icon">{{ dataStore.getCategoryIcon(editableItem.Kategorie) }}</v-icon>
          </v-row>
        </v-card-text>
        </v-col>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" :md="showWerbegrafik ? 7 : 12">
            <p class="mb-3"> <input class="text-subtitle-1 text-medium-emphasis" v-model="editableItem.Wer" placeholder="Wer" type="text" /> </p>
            <p class="mb-1 col-container"> <v-icon>mdi-map-marker</v-icon> <div class="row-container"><p class="col-container"><input v-model="editableItem.Wo" placeholder="Wo" type="text" />,</p> <input v-model="editableItem.Koordinaten" placeholder="Koordinaten" type="text" /> </div></p>
            <p class="mb-1 col-container"> <v-icon>mdi-calendar</v-icon> <div class="row-container"><p class="col-container"><input v-model="editableItem.Wochentag" placeholder="Wochentag" type="text" />,</p> <input v-model="editableItem.Rhythmus" placeholder="Rhythmus" type="text" /> </div></p>
            <p class="mb-1 col-container"> <v-icon>mdi-clock</v-icon> <div class="row-container"><p class="col-container"><input v-model="editableItem.Uhrzeit_Start" placeholder="Uhrzeit Start (HH:MM)" type="text" /> -</p> <input v-model="editableItem.Uhrzeit_Ende" placeholder="Uhrzeit Ende (HH:MM)" type="text" /> </div></p>
            <p class="mt-5"> <textarea v-model="editableItem.Link" placeholder="Link" type="text" :rows="isMobile ? '2' : '1'"/> </p>
          </v-col>

          <v-col v-if="showWerbegrafik" cols="12" md="5">
            <v-img
                :src="werbegrafikPath!"
                class="werbegrafik-image"
                max-height="300"
                contain
                @error="handleWerbegrafikError"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey-lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
        </v-row>

        <v-row class="edit-info-container">
          <p
              v-if="!isVerificationStaleEditing"
              class="text-grey-darken-1"
          >
            Letzte Überprüfung: {{ verificationLabelEditing ?? 'keine Angabe' }}
          </p>
          <v-alert class="px-2 py-2"
              v-else
              type="warning"
              variant="tonal"
              density="comfortable"
          >
            {{ verificationWarningEditing ?? 'Achtung!' }}
          </v-alert>

          <v-btn size="small" @click="saveEdit">Änderung vorschlagen</v-btn>
          <v-btn size="small" @click="cancelEdit">Abbrechen</v-btn>       
          
        </v-row>
        <v-row v-if="copyEditInfos != null">
          <div class="copyable-textarea-container">
            <textarea
              v-model="copyEditInfos"
              class="copyable-textarea"
              readonly
            ></textarea>
            <button
              @click="copyToClipboard"
              class="copy-button"
              :title="copied ? 'Kopiert!' : 'Kopieren'"
            >
              {{ copied ? "✓" : "📋" }}
            </button>
          </div>
        </v-row>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>

.dialog-container {
  max-width: 1000px;
}

/* Mobile-Ansicht ToDo: fix code or this section -> use "@media ..."" OR use "".XYZ--mobile" ! */
@media (max-width: 767px) {
  .dialog-container {
    position: fixed;
    height: 100%;
  }
}

input, select, textarea {
  background-color: lightgrey;
  padding: 0px 1px;
  border: 1px solid lightgrey;
  border-radius: 3px;
  box-shadow:
    3px 3px 5px rgba(0, 0, 0, 0.2), /* Schatten unten rechts */
    -2px -2px 5px rgba(255, 255, 255, 0.8); /* "Licht" oben links */
}

input, textarea {
  display: inline-block;
  width: 100%;
  max-width: 100%;
}

.dialog-title {
  display: flex;
  text-wrap: initial;
  align-items: center;
  justify-content: space-between;
  column-gap: 16px;
}

.dialog-title__icon {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  opacity: 0.85;
}

.werbegrafik-image {
  border-radius: 8px;
  overflow: hidden;
}

.col-container {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  column-gap: 5px;
}
.row-container {
  display: grid;
  grid-template-columns: auto auto;
  flex-direction: row;
  flex: 1 1 0;
  column-gap: 5px;
}

/* Mobile-Ansicht ToDo: fix code or this section -> use "@media ..."" OR use "".XYZ--mobile" ! */
@media (max-width: 767px) {

  input, textarea {
    display: inline-block;
    width: 100%;
    max-width: 95%;
  }

  .col-container {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
  .row-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    column-gap: 5px;
  }
}


.edit-info-container {
  column-gap: 10px;
  align-items: center;
}

/* Mobile-Ansicht ToDo: fix code or this section -> use "@media ..."" OR use "".XYZ--mobile" ! */
@media (max-width: 767px) {
  .edit-info-container {
    display: grid;
  }
}

.v-btn {
  margin: 3px 0px;
}

.copyable-textarea-container {
  position: relative;
  align-self: left;
  width: 100%;
}

.copyable-textarea {
  width: 100%;
  min-height: 150px;
  padding: 10px;
  padding-right: 40px; /* Platz für den Copy-Button */
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  resize: vertical; /* Nur vertikales Skalieren erlauben */
}

.copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.copy-button:hover {
  background: #e0e0e0;
}

</style>

<style>
/* Global style to shift dialog up */
.dialog-content-shifted {
  margin-top: -5vh !important;
}
</style>