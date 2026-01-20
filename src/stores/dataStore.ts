import { defineStore } from "pinia";
import { getCategoryDefinition } from "../constants/categoryConfig";

const DEFAULT_VERIFICATION_THRESHOLD_MONTHS = 3;

const parseVerificationDate = (rawDate?: string | null): Date | null => {
    if (!rawDate) {
        return null;
    }

    const trimmed = rawDate.trim();
    if (!trimmed) {
        return null;
    }

    const parsed = Date.parse(trimmed);
    if (!Number.isNaN(parsed)) {
        return new Date(parsed);
    }

    const dotSeparated = trimmed.split(".");
    if (dotSeparated.length === 3) {
        const [day, month, year] = dotSeparated.map(part => part.trim());
        if (day && month && year) {
            const isoCandidate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            const fallbackParsed = Date.parse(isoCandidate);
            if (!Number.isNaN(fallbackParsed)) {
                return new Date(fallbackParsed);
            }
        }
    }

    return null;
};

const formatVerificationDate = (rawDate?: string | null): string | null => {
    const date = parseVerificationDate(rawDate);
    if (!date) {
        return null;
    }

    return date.toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export interface Filter {
    column: string;
    values: string[];
}

export type DataRow = Record<string, string | undefined>;

export const useDataStore = defineStore('dataStore', {
  state: () => ({
      data: [] as DataRow[],
      columns: [
            { title: 'Was', key: 'Was' },
            { title: 'Kategorie', key: 'Kategorie' },
            { title: 'Wochentag', key: 'Wochentag' },
            { title: 'Rhythmus', key: 'Rhythmus' },
            { title: 'Uhrzeit Start', key: 'Uhrzeit_Start' },
            { title: 'Uhrzeit Ende', key: 'Uhrzeit_Ende' },
            // the following row is somehow not computed and you cannot access the item.Uhrzeit parameter elswehere
            { title: 'Uhrzeit', key: 'Uhrzeit', value: (item: DataRow) => `${item.Uhrzeit_Start ?? 'unbekannter Start'} - ${item.Uhrzeit_Ende ?? 'unbekanntes Ende'}` },
            { title: 'Wo', key: 'Wo' },
            { title: 'Koordinaten', key: 'Koordinaten' },
            { title: 'Wer', key: 'Wer' },
            { title: 'Link', key: 'Link' },
            { title: 'Letzte Überprüfung', key: 'Letzte_Ueberpruefung' },
            { title: 'Kommentar', key: 'Kommentar' },
          ],
      filter: [] as Filter[],
      current_item: null as DataRow | null,
      verificationThresholdMonths: DEFAULT_VERIFICATION_THRESHOLD_MONTHS,
      isTableFormat: false,
      heuteFilterActive: false,
  }),
    actions: {
        // Add actions here as needed
        set_data(newData: DataRow[]) {

             //entries who are inactive should be hidden by default: d["inaktiv?"] != "inaktiv")
            newData = newData.filter((d: DataRow) => d["inaktiv?"] != "inaktiv");

            this.data = newData;
        },
        // not needed at the moment since the raw data should already be sorted before (using a spreadsheet app with filters)
        /*sort_data() {
            // sort loaded dataset by category, day of the week and title of the event/offer
            this.data.sort((a: DataRow, b: DataRow) => {
                if (a.Kategorie < b.Kategorie) return -1;
                if (a.Kategorie > b.Kategorie) return 1;
                if (a.Wochentag < b.Wochentag) return -1;
                if (a.Wochentag > b.Wochentag) return 1;
                if (a.Was < b.Was) return -1;
                if (a.Was > b.Was) return 1;
                return 0;
            });
        },*/
        get_columns(column_subset?: string[]) {
            if (column_subset) {
                return this.columns.filter(column => column_subset.includes(column.key));
            }
            return this.columns;
        },
        get_filtered_data() {
            let filteredData = this.data;
            
            // Apply heute filter first (excludes always-open events)
            if (this.heuteFilterActive) {
                const today = new Date();
                const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
                // Map JavaScript day (0=Sun, 1=Mon, ...) to dataset format (1=Mon, 2=Tue, ..., 7=Sun)
                const datasetDayNumber = dayOfWeek === 0 ? 7 : dayOfWeek;
                
                filteredData = filteredData.filter(item => {
                    const wochentag = item.Wochentag ?? '';
                    const rhythmus = item.Rhythmus ?? '';
                    
                    // Exclude always-open events: "0 alle Tage", "8 wenn geöffnet", or rhythmus contains "immer"
                    if (wochentag.startsWith('0 ') || wochentag.startsWith('8 ')) {
                        return false;
                    }
                    if (rhythmus.toLowerCase().includes('immer')) {
                        return false;
                    }
                    
                    // Check if the event happens on today's weekday
                    // Wochentag format: "1 Montag", "2 Dienstag", etc.
                    const dayNumber = parseInt(wochentag.charAt(0), 10);
                    return dayNumber === datasetDayNumber;
                });
            }
            
            // Apply regular column filters
            if (this.filter.length === 0) {
                return filteredData;
            }
            return filteredData.filter(item => {
                return this.filter.every(f => {
                    const value = item[f.column] ?? '';
                    return value !== '' && f.values.includes(value);
                });
            });
        },
        add_filter(column: string, values: string[]) {
            if (values.length === 0) {
                this.clear_filter(column);
                return;
            }

            const existingFilter = this.filter.find(f => f.column === column);
            if (existingFilter) {
                existingFilter.values = values
            } else {
                this.filter.push({column, values: values});
            }
        },
        clear_filter(column: string) {
            this.filter = this.filter.filter(f => f.column !== column);
        },
        setHeuteFilter(active: boolean) {
            this.heuteFilterActive = active;
        },
        set_current_item(item: DataRow) {
            this.current_item = item;
        },
        clear_current_item() {
            this.current_item = null;
        },
        switchTableFormat() {
            this.isTableFormat = !this.isTableFormat;
        },
        getTableFormat() {
            return this.isTableFormat;
        },
        getFormattedDay(day: string) : string {
            const firstSpaceIndex = day.indexOf(' ');
            const title = firstSpaceIndex === -1 ? day : day.substring(firstSpaceIndex + 1);
            return title;
        },
        getCardColor(category: string): string {    
            console.log('def :', getCategoryDefinition(category)?.color);                   
            return getCategoryDefinition(category)?.color ?? '#d5d5d5';
        },
        getCategoryIcon(category?: string | null): string | undefined {
            return getCategoryDefinition(category)?.icon;
        },
        setVerificationThresholdMonths(months: number) {
            this.verificationThresholdMonths = months;
        },
        getVerificationCutoff(): Date {
            const cutoff = new Date();
            cutoff.setHours(0, 0, 0, 0);
            cutoff.setMonth(cutoff.getMonth() - this.verificationThresholdMonths);
            return cutoff;
        },
        isVerificationStale(rawDate?: string | null): boolean {
            const date = parseVerificationDate(rawDate);
            if (!date) {
                return true;
            }

            return date < this.getVerificationCutoff();
        },
        getVerificationWarning(rawDate?: string | null): string | null {
            if (!this.isVerificationStale(rawDate)) {
                return null;
            }

            const formatted = formatVerificationDate(rawDate);
            if (formatted) {
                return `Achtung! Letzte Überprüfung am ${formatted}!`;
            }

            return 'Achtung! Event bisher nicht geprüft!';
        },
        getVerificationLabel(rawDate?: string | null): string | null {
            const formatted = formatVerificationDate(rawDate);
            if (formatted) {
                return formatted;
            }
            return null;
        },
        shouldShowVerificationWarning(item: DataRow | null): boolean {
            if (!item) {
                return false;
            }
            return this.isVerificationStale(item.Letzte_Ueberpruefung);
        },
        /**
         * Checks if the Werbegrafik value is a valid filename (not "yes", "no", or empty).
         * Returns the filename if valid, or null otherwise.
         */
        getWerbegrafikFilename(item: DataRow | null): string | null {
            if (!item) {
                return null;
            }
            
            const value = item['Werbegrafik?'];
            if (!value) {
                return null;
            }
            
            const trimmed = value.trim();
            if (!trimmed) {
                return null;
            }
            
            // Filter out common non-filename values (case-insensitive)
            const invalidValues = ['yes', 'no', 'ja', 'nein', 'true', 'false', '1', '0'];
            if (invalidValues.includes(trimmed.toLowerCase())) {
                return null;
            }
            
            // Check if the value looks like a filename (contains a file extension)
            // Common image extensions: jpg, jpeg, png, gif, webp, svg
            const imageExtensions = /\.(jpe?g|png|gif|webp|svg|bmp|ico)$/i;
            if (!imageExtensions.test(trimmed)) {
                return null;
            }
            
            return trimmed;
        },
        /**
         * Returns the full path to the Werbegrafik image if it exists, or null otherwise.
         */
        getWerbegrafikPath(item: DataRow | null): string | null {
            const filename = this.getWerbegrafikFilename(item);
            if (!filename) {
                return null;
            }
            
            return `/werbegrafik/${filename}`;
        }
    }
});