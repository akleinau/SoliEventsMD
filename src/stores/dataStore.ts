import {defineStore} from "pinia";

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
          { title: 'Eventtyp', key: 'Eventtyp' },
            { title: 'Kommentar', key: 'Kommentar' },
            { title: 'Letzte Überprüfung', key: 'Letzte_Ueberpruefung' },
            { title: 'Link', key: 'Link' },
            { title: 'Rhythmus', key: 'Rhythmus' },
            { title: 'Uhrzeit Start', key: 'Uhrzeit_Start' },
            { title: 'Uhrzeit Ende', key: 'Uhrzeit_Ende' },
            { title: 'Uhrzeit', key: 'Uhrzeit', value: (item: DataRow) => `${item.Uhrzeit_Start ?? ''} - ${item.Uhrzeit_Ende ?? ''}` },
            { title: 'Was', key: 'Was' },
            { title: 'Wer', key: 'Wer' },
            { title: 'Wo', key: 'Wo' },
            { title: 'Wochentag', key: 'Wochentag' },
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
        format_weekday(day: string) {
            let parts = day.split(" ");
            let title = parts.length > 1 ? parts[1] : parts[0];

            if (title == 'AlleTage') {
                title = 'Alle Tage';
            }

            return title
        },
        getCardColor(eventtyp: string): string {
            const colors: Record<string, string> = {
                'Essen': '#ffebd9',
                'Bücher': '#dbebff',
                'Reparieren': '#e1ffe1',
                'Begegnen': '#fcd8d8',
                'Ressourcen': '#FFFACD',
                'Digital': '#eae2fd',
            };
            return colors[eventtyp] || '#d5d5d5'; // Default color if not found
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