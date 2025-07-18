import {defineStore} from "pinia";

export const useDataStore = defineStore('dataStore', {
  state: () => ({
      data: [],
      columns: [
          { title: 'Eventtyp', key: 'Eventtyp' },
            { title: 'Kommentar', key: 'Kommentar' },
            { title: 'Letzte Überprüfung', key: 'Letzte_Ueberpruefung' },
            { title: 'Link', key: 'Link' },
            { title: 'Rhythmus', key: 'Rhythmus' },
            { title: 'Uhrzeit Start', key: 'Uhrzeit_Start' },
            { title: 'Uhrzeit Ende', key: 'Uhrzeit_Ende' },
            { title: 'Uhrzeit', key: 'Uhrzeit', value: item => `${item.Uhrzeit_Start} - ${item.Uhrzeit_Ende}` },
            { title: 'Was', key: 'Was' },
            { title: 'Wer', key: 'Wer' },
            { title: 'Wo', key: 'Wo' },
            { title: 'Wochentag', key: 'Wochentag' },
          ],
  }),
    actions: {
        // Add actions here as needed
        set_data(newData) {
            this.data = newData;
        },
        get_columns(column_subset) {
            if (column_subset) {
                return this.columns.filter(column => column_subset.includes(column.key));
            }
            return this.columns;
        }
    }
});