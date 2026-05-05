<script setup lang="ts">

import { computed, onMounted, ref, watch } from "vue";
import { useDataStore } from "../stores/dataStore.ts";
import { MAIN_CATEGORIES, SUB_CATEGORIES } from "../constants/categoryConfig";

const props = withDefaults(defineProps<{
  attachTarget?: string;
}>(), {
  attachTarget: '.datatable-wrapper',
});

const dataStore = useDataStore()

const active = ref(true);

type DataRow = Record<string, string | undefined>;
const editableItemGroup = ref(null as DataRow | null);
const copyEditInfos = ref(null as String | null);
const isEditing = ref(false);
const isNew = ref(false);


onMounted(() => {
  active.value = true;
  editableItemGroup.value = JSON.parse(JSON.stringify(dataStore.current_itemgroup));

  // Wenn Card "Neues Angebot anlegen" das current_item ist, direkt zum Bearbeitungsmodus wechseln!
  isNew.value = (editableItemGroup.value?.Was === "Neues Angebot anlegen");
  if (isNew.value) isEditing.value = true;
})

watch(() => active.value, (newValue) => {
  if (!newValue) {
    dataStore.current_itemgroup = null;
    dataStore.clear_focused_itemgroup();
  }
})

const itemgroup = computed(() => dataStore.current_itemgroup)

const isMobile = computed(() => dataStore.isMobile)

const isVerificationStale = computed(() => {
  if (!itemgroup.value) {
    return false;
  }
  return dataStore.shouldShowVerificationWarning(itemgroup.value);
});

const verificationLabel = computed(() => {
  if (!itemgroup.value) {
    return null;
  }
  return dataStore.getVerificationLabel(itemgroup.value.Letzte_Ueberpruefung);
});

const verificationWarning = computed(() => {
  if (!itemgroup.value) {
    return null;
  }
  return dataStore.getVerificationWarning(itemgroup.value.Letzte_Ueberpruefung);
});

// Werbegrafik image handling
const werbegrafikPath = computed(() => {
  return dataStore.getWerbegrafikPath(itemgroup.value);
});

const werbegrafikError = ref(false);

// Reset error state when itemgroup changes
watch(() => itemgroup.value, () => {
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

  const openInSameWindow = confirm("Soll Dein E-Mail-Programm geöffnet werden, damit Du eine vorbereitete E-Mail komfortabel versenden kannst?");

  if (openInSameWindow) {
    window.location.href = mailtoLink; // "Gleiches" Fenster
  } else {
  }
};

const closeDialog = () => {
  active.value = false;
  isNew.value = false;
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  //editableItemGroup.value = dataStore.current_item;
  editableItemGroup.value = JSON.parse(JSON.stringify(dataStore.current_itemgroup));
};
const cancelEdit = () => {
  copyEditInfos.value = null;
  isEditing.value = false;

  // wenn das Neue itemgroup nicht mehr bearbeitet wird, wird der Dialog direkt komplett geschlossen, statt zur reinen Card-Detailansicht zurückzukehren
  if (isNew.value) closeDialog();
};

const getFormattedDateToday = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0'); // Tag (DD)
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Monat (MM, +1 weil Monate 0-indexiert sind)
  const year = today.getFullYear(); // Jahr (YYYY)
  return `${day}.${month}.${year}`;
}

const dataRowtoCsv = (data: DataRow | any) => {
  const delimiter = ","
  // Header (Spaltennamen) extrahieren
  const headers = Object.keys(data).join(delimiter);

  // Werte extrahieren und in Anführungszeichen setzen, falls nötig
  const values = Object.values(data)
    .map(value => {
      if (typeof value === "string" && (value.includes(delimiter) || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`; // Anführungszeichen escapen
      }
      return value;
    })
    .join(delimiter);

  // CSV-Zeile zurückgeben
  return `${headers}\n${values}`;
}

const saveEdit = () => {
  if (editableItemGroup.value)
  editableItemGroup.value.Letzte_Ueberpruefung = getFormattedDateToday().toString();

  // remove columns with sensitive data
  delete editableItemGroup.value?.Kontakt;
  delete editableItemGroup.value?.Kommentar;
  delete itemgroup.value?.Kontakt;
  delete itemgroup.value?.Kommentar;
  
  const contentAsCsv = dataRowtoCsv(editableItemGroup?.value);
  const oldContentAsCsv = dataRowtoCsv(itemgroup?.value)
  copyEditInfos.value = "Hallo,\nich möchte folgende Veränderung eines Soli-Angebots melden.\nLiebe Grüße,\nDEIN_NAME" + "\n\n# NEU:\n\n" + contentAsCsv + "\n\n# ALT:\n\n" + oldContentAsCsv;
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

const sortedWochentage = dataStore.getSortedWochentageOptionen();

</script>

<template>
  <v-dialog 
    v-model="active" 
    class="dialog-container" 
    :attach="props.attachTarget" 
    :contained="true" 
    :scrim="false"
    :persistent="true"
    :no-click-animation="true"
    content-class="dialog-content-shifted"
  >
    <!-- Anzeigemodus (View) -->
    <v-card v-if="itemgroup && !isEditing"
      :style="{
        'background': dataStore.getCardColor(itemgroup.Kategorie), 
        'border': '5px solid color-mix(in oklch, ' + dataStore.getCardColor(itemgroup.Kategorie) + ', black 20%)'
      }">    
      <v-card-title class="dialog-title">
        <span>{{ itemgroup.Was }}</span>
        <v-tooltip :text="dataStore.getIconText(itemgroup)" location="top" open-on-click>
          <template v-slot:activator="{ props }">
              <v-icon v-bind="props" size="x-large" color="black" class="dialog-title__icon">{{ dataStore.getIcon(itemgroup) }}</v-icon>
          </template>
        </v-tooltip>        
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col v-if="itemgroup.Kurzbeschreibung != ''"class="mb-3 text-subtitle-1 text-medium-emphasis">{{ itemgroup.Kurzbeschreibung }}</v-col>
          <v-col cols="12" :md="showWerbegrafik ? 7 : 12">            
            <div class="mb-1 col-container"> <v-icon>mdi-account-question</v-icon> <div>{{ itemgroup.Wer }}</div></div>
            <div v-if="itemgroup.Kategorie != 'digitales'" class="mb-1 col-container"> <v-icon>mdi-map-marker</v-icon> <div>{{ itemgroup.Wo }}</div></div>
            <div v-if="itemgroup.Kategorie != 'digitales'" v-for="timeslot in itemgroup.timeSlots" class="mb-1 col-container"> 
              <v-icon>mdi-calendar</v-icon>
              <div>
                {{ dataStore.getFormattedDay(timeslot.Wochentag ?? '') }}, 
                {{ timeslot.Rhythmus }},
                {{ timeslot.Uhrzeit_Start }} Uhr bis {{ timeslot.Uhrzeit_Ende }} Uhr
              </div>
            </div>
            <div v-for="timeslot in itemgroup.timeSlots" class="col-container">
              <v-icon>mdi-calendar</v-icon> 
              <div class="row-container">
                <div>{{ dataStore.getFormattedDay(timeslot.Wochentag ?? '') }}, {{ timeslot.Rhythmus }}</div>
                <div>{{ timeslot.Uhrzeit_Start }} - {{ timeslot.Uhrzeit_Ende }}</div>
              </div>
            </div>
            <div v-if="itemgroup.Kommentar != ''" class="mb-1 col-container"> <v-icon>mdi-comment</v-icon> <div>{{ itemgroup.Kommentar }}</div></div>
            <div v-if="itemgroup.Kontakt != ''" class="mb-1 col-container"> <v-icon>mdi-email</v-icon> <div>{{ itemgroup.Kontakt }}</div></div>
            <div class="mt-5"> <a :href="itemgroup.Link" target="_blank"> {{ itemgroup.Link }} </a> </div>
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
      <!-- Bearbeitungsmodus (Edit) -->
        <!-- Bearbeitungsmodus (Edit) -->
          <!-- Bearbeitungsmodus (Edit) -->
        <!-- Bearbeitungsmodus (Edit) -->
      <!-- Bearbeitungsmodus (Edit) -->
    <!-- Bearbeitungsmodus (Edit) -->
    <v-card v-if="editableItemGroup && isEditing"
      :style="{
        'background': dataStore.getCardColor(editableItemGroup.Kategorie), 
        'border': '5px solid color-mix(in oklch, ' + dataStore.getCardColor(editableItemGroup.Kategorie) + ', black 20%)'
      }">
      <v-card-title class="dialog-title pb-0 pt-5">
        <v-col class="pb-0">
          <v-row>
            <textarea v-model="editableItemGroup.Was" placeholder="Was" type="text" :rows="isMobile ? '2' : '1'" />
          </v-row>
          <v-row>
            <v-card-text>
              <v-row class="align-center justify-end">
                <div class="d-flex mr-2">Inaktiv: 
                    <input v-model="editableItemGroup.inaktiv"
                      type="checkbox"
                      true-value="inaktiv"
                      false-value="aktiv"
                      class="ml-1" />
                </div>
                <div>Unterkategorie: 
                  <select v-model="editableItemGroup.Unterkategorie">
                    <option v-for="option in SUB_CATEGORIES" :value="option.path" :placeholder="editableItemGroup.Unterkategorie">
                      {{ option.label }}
                    </option>
                  </select>
                  <v-tooltip :text="dataStore.getSubCategoryName(editableItemGroup.Unterkategorie ?? '')" location="top" open-on-click>
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" size="x-large" color="black" class="dialog-title__icon">{{ dataStore.getSubCategoryIcon(editableItemGroup.Unterkategorie) }}</v-icon>
                    </template>
                  </v-tooltip>
                </div>
                <div>Kategorie: 
                  <select v-model="editableItemGroup.Kategorie">
                    <option v-for="option in MAIN_CATEGORIES" :value="option.path" :placeholder="editableItemGroup.Kategorie">
                      {{ option.label }}
                    </option>
                  </select>
                  <v-tooltip :text="dataStore.getCategoryName(editableItemGroup.Kategorie ?? '')" location="top" open-on-click>
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" size="x-large" color="black" class="dialog-title__icon">{{ dataStore.getCategoryIcon(editableItemGroup.Kategorie) }}</v-icon>
                    </template>
                  </v-tooltip>
                </div>
              </v-row>
            </v-card-text>
          </v-row>
        </v-col>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="text-subtitle-1 text-medium-emphasis">
            <textarea v-model="editableItemGroup.Kurzbeschreibung" maxlength="240" placeholder="Kurzbeschreibung" type="text" :rows=" isMobile ? 3 : 2" /></v-col>
          <v-col cols="12" :md="showWerbegrafik ? 7 : 12">
            <div class="mb-1 col-container"> 
              <v-icon>mdi-account-question</v-icon>
              <input v-model="editableItemGroup.Wer" placeholder="Wer" type="text" /> 
            </div>
            <div v-if="editableItemGroup.Kategorie != 'digitales'" class="mb-1 col-container">
              <v-icon>mdi-map-marker</v-icon> 
              <div class="row-container">
                <p class="col-container">
                  <textarea v-model="editableItemGroup.Wo" placeholder="Wo" type="text" :rows="isMobile ? '2' : '1'" />
                  ,
                </p> 
                <p class="col-container">
                <input v-model="editableItemGroup.Koordinaten" placeholder="Koordinaten" type="text" /> 
                  .
                </p> 
              </div>
            </div>
            <div v-if="editableItemGroup.Kategorie != 'digitales'" v-for="timeslot in editableItemGroup.timeSlots" class="mb-1 col-container">
              <v-icon>mdi-calendar</v-icon>
              <div class="row3-container">
                <p class="col-container" style="width: 100%;">
                  <select v-model="timeslot.Wochentag" style="width: 100%;">
                    <option v-for="option in sortedWochentage" :value="option.value" placeholder="timeslot.Wochentag">
                      {{ option.title }}
                    </option>
                  </select>
                  ,
                </p> 
                <p class="col-container">
                <input v-model="timeslot.Rhythmus" placeholder="Rhythmus" type="text" />
                  ,
                </p> 
                <div class="col-container">
                  <p class="col-container"><input v-model="timeslot.Uhrzeit_Start" placeholder="Start (HH:MM)" type="text" /> Uhr</p>
                  <p>bis</p>
                  <p class="col-container"><input v-model="timeslot.Uhrzeit_Ende" placeholder="Ende (HH:MM / 'open end')" type="text" /> Uhr.</p>
                </div>
              </div>
            </div>
            
            <div class="mb-1 col-container"> <v-icon>mdi-comment</v-icon> <input v-model="editableItemGroup.Kommentar" maxlength="120" placeholder="Kommentar/Hinweis" type="text" /> </div>
            <div class="mb-1 col-container"> <v-icon>mdi-email</v-icon> <input v-model="editableItemGroup.Kontakt" maxlength="60" placeholder="Kontakt" type="text" /> </div>

            <div class="mt-5"> <textarea v-model="editableItemGroup.Link" placeholder="Link" type="text" :rows="isMobile ? '2' : '1'"/> </div>
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

          <v-btn size="small" @click="saveEdit">Änderung vorschlagen</v-btn>
          <v-btn size="small" @click="cancelEdit">Abbrechen</v-btn>       
          
        </v-row>
        <v-row v-if="copyEditInfos != null">
          <div class="copyable-textarea-container">
            <textarea
              v-model="copyEditInfos"
              class="copyable-textarea"
              style="font-size: 12px;"
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

        <v-row v-if="copyEditInfos != null" class="pt-2" style="justify-content: center; align-content: center;">
          <v-alert class="px-2 py-2"
              type="info"
              variant="flat"
              density="comfortable"
          >
          <div style="text-align: center;">
            <i>
              Schicke die vorbereitete Nachricht komfortabel <b><u style="cursor: pointer;" @click="saveEdit">» per Mail «</u></b> ab!
              <br>Oder kopiere den Text und sende ihn <a href="https://cloud.magdeburg.jetzt/apps/forms/embed/sWAy75S2qAq5JeccorqTEQFq" target="_blank"><b>» per Kontaktformular «</b></a> ein.
            </i>
          </div>
          </v-alert>
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

a {
  color: inherit;
}

input, select, textarea {
  background-color: white;
  padding: 0px 1px;
  border: 1px solid white;
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
  padding: 15x 15px 0px 15px;
}

.dialog-title__icon {
  width: 40px;
  height: 40px;
  flex-shrink: 1;
  opacity: 0.85;
}

/* Mobile-Ansicht */
@media (max-width: 767px) {
  .dialog-title__icon {
    width: 40px;
    height: 40px;
  }
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
  grid-template-columns: 1fr 1fr;
  flex-direction: row;
  flex: 1 1 0;
  column-gap: 5px;
}
.row3-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  flex-direction: row;
  flex: 1 1 0;
  column-gap: 5px;
}

/* Mobile-Ansicht ToDo: fix code or this section -> use "@media ..."" OR use "".XYZ--mobile" ! */
@media (max-width: 767px) {

  input, textarea {
    display: inline-block;
    width: 100%;
    max-width: 100%;
  }

  .col-container {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
  .row-container, .row3-container {
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
  min-height: 120px;
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