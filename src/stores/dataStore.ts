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
      focused_item: null as DataRow | null,
      isMapVisible: true,
      verificationThresholdMonths: DEFAULT_VERIFICATION_THRESHOLD_MONTHS,
      viewMode: 'cards' as string,
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
                
                // Map JavaScript day to German day name
                const dayNames = ['sonntag', 'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag'];
                const todayName = dayNames[dayOfWeek];
                const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                
                filteredData = filteredData.filter(item => {
                    const wochentag = item.Wochentag ?? '';
                    const rhythmus = item.Rhythmus ?? '';
                    const itemDayName = this.extractDayName(wochentag);
                    
                    // Exclude always-open events: "wenn geöffnet" or rhythmus contains "immer"
                    if (itemDayName === 'wenn geöffnet') {
                        return false;
                    }
                    if (rhythmus.toLowerCase().includes('immer')) {
                        return false;
                    }
                    
                    // Include "alle Tage" events
                    if (itemDayName === 'alletage' || itemDayName === 'alle tage') {
                        return true;
                    }
                    
                    // Check if the event happens on today's weekday
                    if (itemDayName === todayName) {
                        return true;
                    }
                    
                    // "werktags" matches if today is a weekday
                    if (itemDayName === 'werktags' && isWeekday) {
                        return true;
                    }
                    
                    // "wochenende" matches if today is a weekend day
                    if (itemDayName === 'wochenende' && isWeekend) {
                        return true;
                    }
                    
                    return false;
                });
            }
            
            // Apply regular column filters
            if (this.filter.length === 0) {
                return filteredData;
            }
            return filteredData.filter(item => {
                return this.filter.every(f => {
                    const value = item[f.column] ?? '';
                    if (value === '') return false;
                    
                    // Use special matching logic for Wochentag
                    if (f.column === 'Wochentag') {
                        return this.matchesWochentagFilter(value, f.values);
                    }
                    
                    return f.values.includes(value);
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
        // Helper to extract the day name from Wochentag (removes number prefix)
        extractDayName(wochentag: string): string {
            const firstSpaceIndex = wochentag.indexOf(' ');
            return firstSpaceIndex === -1 ? wochentag.toLowerCase() : wochentag.substring(firstSpaceIndex + 1).toLowerCase();
        },
        // Check if a Wochentag value matches any of the selected filter values
        // Handles edge cases like "alle Tage", "werktags", "Wochenende"
        matchesWochentagFilter(itemWochentag: string, filterValues: string[]): boolean {
            // Direct match
            if (filterValues.includes(itemWochentag)) {
                return true;
            }
            
            const itemDayName = this.extractDayName(itemWochentag);
            
            // Define day groups
            const weekdays = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag'];
            const weekendDays = ['samstag', 'sonntag'];
            const allDays = [...weekdays, ...weekendDays];
            
            // Get day names from filter values
            const filterDayNames = filterValues.map(v => this.extractDayName(v));
            
            // "AlleTage" or similar matches any specific day filter
            if (itemDayName === 'alletage' || itemDayName === 'alle tage') {
                return filterDayNames.some(day => allDays.includes(day));
            }
            
            // "werktags" matches weekday filters (Mon-Fri)
            if (itemDayName === 'werktags') {
                return filterDayNames.some(day => weekdays.includes(day));
            }
            
            // "Wochenende" matches weekend filters (Sat-Sun)
            if (itemDayName === 'wochenende') {
                return filterDayNames.some(day => weekendDays.includes(day));
            }
            
            return false;
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
        set_focused_item(item: DataRow | null) {
            this.focused_item = item;
        },
        clear_focused_item() {
            this.focused_item = null;
        },
        setMapVisible(visible: boolean) {
            this.isMapVisible = visible;
        },
        toggleMapVisible() {
            this.isMapVisible = !this.isMapVisible;
        },
        switchViewMode() {
            this.viewMode = this.viewMode === 'cards' ? 'list' : 'cards';
            localStorage.setItem('viewMode', this.viewMode.toString());
        },
        loadViewMode() {
            const cachedViewMode = localStorage.getItem('viewMode')?.toString();
            this.viewMode = cachedViewMode ? cachedViewMode : 'cards';  
        },        
        getViewMode() : string {
            return this.viewMode;
        },
        getFormattedDay(day: string) : string {
            const firstSpaceIndex = day.indexOf(' ');
            const title = firstSpaceIndex === -1 ? day : day.substring(firstSpaceIndex + 1);
            return title;
        },
        getCardColor(category: string): string {                  
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
