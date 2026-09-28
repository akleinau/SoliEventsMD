// All city-specific settings in one place. You can edit them once here to change them everywhere in the site

// The changes made here are not enough, you maybe also have to change / add:
// Datenschutzerklärung, Feedback Form Provider, Domain / EMail-Addresses, deployment strategy, branding etc 

const city = 'Magdeburg';
const domain = 'magdeburg-teilt.de';

export const siteConfig = {
    /** City the offers are in, used in texts like "Angebote in …" */
    city,
    domain,
    websiteUrl: `https://${domain}/`,

    email: {
        contact: 'kontakt@magdeburg-teilt.de',
        changes: 'aenderung@magdeburg-teilt.de',
        privacy: 'datenschutz@magdeburg-teilt.de',
    },

    /** Nextcloud feedback form (embedded on /kontakt and linked in the edit dialog) */
    feedbackFormUrl: 'https://cloud.magdeburg.jetzt/apps/forms/embed/sWAy75S2qAq5JeccorqTEQFq',

    /** Group running this site, shown in the footer ("ein Projekt von …"). */
    organizer: {
        name: 'Sharing in Magdeburg',
        socialLinks: [
            { text: 'Sharing in Magdeburg (Telegram)', url: 'https://t.me/sharinginmagdeburg' },
        ],
    },

    /** Initial map view */
    map: {
        center: [52.1250, 11.6390] as [number, number],
        zoom: 12,
    },

    /** CSV file with the offers, relative to VITE_CSV_URL */
    dataFile: 'dataset/SoliAngeboteMD-2026-07-06.csv',

    /** Responsible person for Impressum and Datenschutz */
    legal: {
        name: 'Benjamin Parske',
        addressLines: [
            'c/o Netzwerk Zukunft Sachsen-Anhalt e.V.',
            'Olvenstedter Str. 10',
            '39108 Magdeburg',
        ],
    },

    /** Signature at the end of the "about" dialog */
    teamSignature: 'Anna, Benni, Ina und Jonas :)',
};

/** Full site name, e.g. "Magdeburg teilt!" */
export const siteName = `${city} teilt!`;
