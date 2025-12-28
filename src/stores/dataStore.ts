import {defineStore} from "pinia";
import {CATEGORY_CONFIG, getCategoryDefinition} from "../constants/categoryConfig";

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
            { title: 'Uhrzeit', key: 'Uhrzeit', value: (item: DataRow) => `${item.Uhrzeit_Start ?? 'test starttime'} - ${item.Uhrzeit_Ende ?? 'test endtime'}` },
            { title: 'Wo', key: 'Wo' },
            { title: 'Wer', key: 'Wer' },
            { title: 'Link', key: 'Link' },
            { title: 'Letzte Überprüfung', key: 'Letzte_Ueberpruefung' },
            { title: 'Kommentar', key: 'Kommentar' },
          ],
      filter: [] as Filter[],
      current_item: null as DataRow | null,
            verificationThresholdMonths: DEFAULT_VERIFICATION_THRESHOLD_MONTHS,
  }),
    actions: {
        // Add actions here as needed
        set_data(newData: DataRow[]) {

             //entries who are inactive should be hidden by default: d["inaktiv?"] != "inaktiv")
            newData = newData.filter((d: DataRow) => d["inaktiv?"] != "inaktiv");

            this.data = newData;
        },
        sort_data() {
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
        },
        get_columns(column_subset?: string[]) {
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
        set_current_item(item: DataRow) {
            this.current_item = item;
        },
        clear_current_item() {
            this.current_item = null;
        },
        // ToDo probably remove in the future
        format_weekday(day: string) {
            let parts = day.split(" ");
            let title = parts.length > 1 ? parts[1] : parts[0];

            if (title == 'AlleTage') {
                title = 'Alle Tage';
            }

            return title
        },
        getCardColor(category: string): string {
            return CATEGORY_CONFIG[category]?.color ?? '#d5d5d5';
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
        }
    }
});