import { defineStore } from "pinia";
import { getCategoryDefinition, getSubCategoryDefinition } from "../constants/categoryConfig";

export interface SortLevel {
    column: string;
    direction: 'asc' | 'desc';
}

const DEFAULT_VERIFICATION_THRESHOLD_MONTHS = 3;
const MAX_SORT_LEVELS = 3;
const NEWEST_SORT_COLUMN = 'Letzte_Ueberpruefung';

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

const normalizeSearchText = (value: string): string => {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
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
            { title: 'Unterkategorie', key: 'Unterkategorie' },
            { title: 'Nutzung', key: 'Nutzung' },
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
      empty_item: null as DataRow | null,
      current_item: null as DataRow | null,
      focused_item: null as DataRow | null,
      isMobile: false,
      isMapVisible: true,
      verificationThresholdMonths: DEFAULT_VERIFICATION_THRESHOLD_MONTHS,
      viewMode: 'cards' as string,
      heuteFilterActive: false,
      searchTerm: '',
      sortLevels: [] as SortLevel[],
  }),
    actions: {
        // Add actions here as needed
        set_data(newData: DataRow[]) {
            //entries who are inactive should be hidden by default: d["inaktiv"] != "inaktiv")
            newData = newData.filter((d: DataRow) => d["inaktiv"] != "inaktiv");

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
        // ToDo: wofür wird das benötigt?
        get_columns(column_subset?: string[]) {
            if (column_subset) {
                return this.columns.filter(column => column_subset.includes(column.key));
            }
            return this.columns;
        },
        get_category_filtered_data() {
            let filteredData = this.data;

            // Apply *only* category column filter               
            const categoryFilters = this.filter.filter(f => f.column === "Kategorie");
            
            if (categoryFilters.length === 0) {
                return filteredData;
            }

            return filteredData.filter(item => {
                return categoryFilters.every(f => {
                    const value = item[f.column] ?? '';
                    if (value === '') return false;
                    return f.values.includes(value);
                });
            });
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
                    const itemDayName = this.extractDayName(wochentag);
                    
                    // Exclude events without a specific schedule
                    if (itemDayName === 'wenn geöffnet') {
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
            if (this.filter.length > 0) {
                filteredData = filteredData.filter(item => {
                    return this.filter.every(f => {
                        const value = item[f.column] ?? '';
                        if (value === '') return false;

                        if (f.column === 'Wochentag') {
                            return this.matchesWochentagFilter(value, f.values);
                        }

                        return f.values.includes(value);
                    });
                });
            }

            // Apply search term
            const term = this.searchTerm.trim();
            if (term) {
                const normalizedTerm = normalizeSearchText(term);
                filteredData = filteredData.filter(item => {
                    const searchFields = ['Was', 'Wer', 'Wo', 'Rhythmus', 'Link'];
                    return searchFields.some(field => {
                        const value = item[field] ?? '';
                        return normalizeSearchText(value).includes(normalizedTerm);
                    });
                });
            }

            // Apply sort levels
            if (this.sortLevels.length > 0) {
                filteredData = [...filteredData].sort((a, b) => {
                    for (const level of this.sortLevels) {
                        let result = 0;
                        if (level.column === NEWEST_SORT_COLUMN) {
                            const dateA = parseVerificationDate(a[level.column]);
                            const dateB = parseVerificationDate(b[level.column]);
                            if (dateA === null && dateB === null) result = 0;
                            else if (dateA === null) result = 1;
                            else if (dateB === null) result = -1;
                            else result = dateA.getTime() - dateB.getTime();
                        } else {
                            const valA = (a[level.column] ?? '').toLowerCase();
                            const valB = (b[level.column] ?? '').toLowerCase();
                            result = valA < valB ? -1 : valA > valB ? 1 : 0;
                        }
                        if (result !== 0) {
                            return level.direction === 'asc' ? result : -result;
                        }
                    }
                    return 0;
                });
            }

            return filteredData;
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
        clear_all_filters() {
            this.filter = [];
        },
        prepareEmptyItem() {
            this.empty_item = {
                Was: "Neues Angebot anlegen",
                Kategorie: "",
                Unterkategorie: "",
                Nutzung: "",
                Wochentag: "Wann?",
                Rhythmus: "",
                Uhrzeit_Start: "",
                Uhrzeit_Ende: "",
                Wo: "Wo?",
                Koordinaten: "",
                Wer: "Von wem?",
                Link: "",
                Werbegrafik: "",
                inaktiv: "",
                Letzte_Ueberpruefung: "",
                Kommentar: "",
                Kontakt: "",
                //Telefonnummer: "",
                //Kurzbeschreibung: "",
            };
        },
        getEmptyItem() {
            return this.empty_item;
        },
        // Helper to extract the day name from Wochentag (removes number prefix)
        extractDayName(wochentag: string): string {
            const firstSpaceIndex = wochentag.indexOf(' ');
            return firstSpaceIndex === -1 ? wochentag.toLowerCase() : wochentag.substring(firstSpaceIndex + 1).toLowerCase();
        },

        // Wochentage bzw. alternative Beschreibung (alle Tage, werktags, jeden Tag, ...) - aber keine Aufzählung von Tagen.        
        getSortedWochentageOptionen () {
            if (!this.data) return [];
            const uniqueWochentage = new Set(this.data
                .filter(item => item.Wochentag && item.Wochentag.trim() !== "")
                .flatMap(item =>
                !item.Wochentag
                    ? []
                    : item.Wochentag
                    .split(";")
                    .map(value => value.trim())
                    .filter(value => value !== "")
                ));
                
            // erst mit "0 alle Tage", "1 Montag", ... sortieren
            const sortedWochentage = Array.from(uniqueWochentage).sort()
                // und danach nur noch den 'kurzen' Titel anzeigen (via ".map(...)")
                .map(tag => ({ 
                value: tag, 
                title: this.getFormattedDay(tag ?? '')
                }));
            // "Heute" als erste Option hinzufügen
            return sortedWochentage;
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
        setSearchTerm(term: string) {
            this.searchTerm = term;
        },
        toggleSortLevel(column: string) {
            const idx = this.sortLevels.findIndex(s => s.column === column);
            const isNewestSort = column === NEWEST_SORT_COLUMN;

            if (idx === -1) {
                // Keep sort priorities bounded: when a 4th column is added, drop the oldest one.
                if (this.sortLevels.length >= MAX_SORT_LEVELS) {
                    this.sortLevels.shift();
                }

                // Not selected → add as descending for "Neuste", otherwise ascending.
                this.sortLevels.push({ column, direction: isNewestSort ? 'desc' : 'asc' });
                return;
            }

            if (isNewestSort) {
                if (this.sortLevels[idx].direction === 'desc') {
                    // Descending (newest first) → switch to ascending
                    this.sortLevels[idx].direction = 'asc';
                } else {
                    // Ascending → remove
                    this.sortLevels.splice(idx, 1);
                }
            } else {
                if (this.sortLevels[idx].direction === 'asc') {
                    // Ascending → switch to descending
                    this.sortLevels[idx].direction = 'desc';
                } else {
                    // Descending → remove
                    this.sortLevels.splice(idx, 1);
                }
            }
        },
        clearSortLevels() {
            this.sortLevels = [];
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
        getCardColor(category: string | undefined): string {                  
            return getCategoryDefinition(category)?.color ?? '#fcd8d8';
        },

        getCategoryName(category?: string | null): string | undefined {
            return getCategoryDefinition(category)?.label ?? 'Neu';
        },
        getCategoryIcon(category?: string | null): string | undefined {
            return getCategoryDefinition(category)?.icon ?? 'mdi-new-box';
        },

        getSubCategoryName(subcategory?: string | null): string | undefined {
            return getSubCategoryDefinition(subcategory)?.label;
        },
        getSubCategoryIcon(subcategory?: string | null): string | undefined {
            return getSubCategoryDefinition(subcategory)?.icon;
        },


        getIconText(item: any) {
            return (item.Unterkategorie && !item.Unterkategorie.includes(";")) ? this.getSubCategoryName(item.Unterkategorie) : this.getCategoryName(item.Kategorie)
        },

        getIcon(item: any) {
            return (item.Unterkategorie && !item.Unterkategorie.includes(";")) ? this.getSubCategoryIcon(item.Unterkategorie) : this.getCategoryIcon(item.Kategorie)
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
        },

        // Prüfen, ob mobiles Gerät
            // wird u.a. bei "Home.vue" genutzt, um zu entscheiden, 
            // ob die Map initial angezeigt werden soll oder nicht (wie z.B. in mobiler Ansicht)
        checkIfMobile () {
            this.isMobile = window.innerWidth <= 768;
            if(this.isMobile) this.isMapVisible = false;
        },
    }
});
