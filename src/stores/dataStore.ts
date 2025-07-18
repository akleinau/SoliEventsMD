import {defineStore} from "pinia";

export interface Filter {
    column: string;
    values: string[];
}

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
      filter: [] as Filter[],
      current_item: null as any,
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
        },
        get_filtered_data() {
            if (this.filter.length === 0) {
                return this.data;
            }
            return this.data.filter(item => {
                return this.filter.every(f => {
                    return f.values.includes(item[f.column]);
                });
            });
        },
        add_filter(column, values) {
            const existingFilter = this.filter.find(f => f.column === column);
            if (existingFilter) {
                existingFilter.values = values
            } else {
                this.filter.push({ column, values: values });
            }
        },
        clear_filter(column) {
            this.filter = this.filter.filter(f => f.column !== column);
        },
        set_current_item(item) {
            this.current_item = item;
        },
        clear_current_item() {
            this.current_item = null;
        }
    }
});