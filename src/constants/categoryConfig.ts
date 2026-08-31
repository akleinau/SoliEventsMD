// Kategorie Icon Imports
import BegegnungIcon from '/src/assets/icons/main/Sprechblase_mit_HG_und_Strichen.svg';
import OnlineIcon from '/src/assets/icons/main/Mauszeiger_mit_HG_und_Strichen.svg';
import LebensmittelIcon from '/src/assets/icons/main/Möhre_mit_HG_und_Strichen.svg';
import RessourcenIcon from '/src/assets/icons/main/Schraubenschlüssel_mit_HG_und_Strichen.svg';
// Unterkategorie Icon Imports
import AktionIcon from '/src/assets/icons/sub/Aktion_Outlines.svg';
import RettenIcon from '/src/assets/icons/sub/Retten_Outlines.svg';
import MobilitaetIcon from '/src/assets/icons/sub/Mobilität_Outlines.svg';
import EssenausgabeIcon from '/src/assets/icons/sub/Essenausgabe_Outlines.svg';
import FutternIcon from '/src/assets/icons/sub/Futtern_Outlines.svg';
import WerkstattIcon from '/src/assets/icons/sub/Werkstatt_Outlines.svg';
import SpielenIcon from '/src/assets/icons/sub/Spielen_Outlines.svg';
import MedienIcon from '/src/assets/icons/sub/Medien_Outlines.svg';
import TextilienIcon from '/src/assets/icons/sub/Textilien_Outlines.svg';
import MoebelIcon from '/src/assets/icons/sub/Möbel_Outlines.svg';
import RaumIcon from '/src/assets/icons/sub/Raum_Outlines.svg';


export interface CategoryDefinition {
  label: string
  path: string
  textcolor: string
  color: string
  icon: string // mdi-icons (automatisch über Vuetify)
  svg: string
  alt: string
}

export interface SubCategoryDefinition {
  label: string
  path: string
  icon: string // mdi-icons (automatisch über Vuetify)
  svg: string
  alt: string
}

export const CATEGORY_CONFIG: Record<string, CategoryDefinition> = {
  begegnung: {
    label: 'Begegnung',
    path: 'begegnung',
    textcolor: 'var(--color-purple)', // Textfarbe
    color: 'var(--color-light-purple)', // Hintergrundfarbe
    icon: 'mdi-account-multiple-outline',
    svg: BegegnungIcon,
    alt: 'Kategorie Begegnung: lilane Sprech-Blase mit lächelndem Gesichtchen drin'
  },
  online: {
    label: 'Online',
    path: 'online',
    textcolor: 'var(--color-yellow)', // Textfarbe
    color: 'var(--color-light-yellow)', // Hintergrundfarbe
    icon: 'mdi-laptop',
    svg: OnlineIcon,
    alt: 'Kategorie Online: gelber Computermaus-Zeiger'
  },
  lebensmittel: {
    label: 'Lebensmittel',
    path: 'lebensmittel',
    textcolor: 'var(--color-orange)', // Textfarbe
    color: 'var(--color-light-orange)', // Hintergrundfarbe
    icon: 'mdi-food-apple-outline',
    svg: LebensmittelIcon,
    alt: 'Kategorie Lebensmittel: orange Karotte mit grünen Blättern'
  },
  ressourcen: {
    label: 'Ressourcen',
    path: 'ressourcen',
    textcolor: 'var(--color-green)', // Textfarbe
    color: 'var(--color-light-green)', // Hintergrundfarbe
    icon: 'mdi-recycle',
    svg: RessourcenIcon,
    alt: 'Kategorie Ressourcen: grüner Schrauben-Schlüssel'
  },
}

export const SUB_CATEGORY_CONFIG: Record<string, SubCategoryDefinition> = {
  aktion: {
    label: 'Aktion',
    path: 'aktion',
    icon: 'mdi-human-handsup',
    svg: AktionIcon,
    alt: 'Unterkategorie Aktion: Megafon'
  },
  retten: {
    label: 'retten',
    path: 'retten',
    icon: 'mdi-hand-extended-outline',
    svg: RettenIcon,  // used as generic fallback icon in dataStore
    alt: 'Unterkategorie retten: zwei einfache Pfeile, die im Kreis führen'
  },
  mobilitaet: {
    label: 'Mobilität',
    path: 'mobilitaet',
    icon: 'mdi-bicycle-cargo',
    svg: MobilitaetIcon,
    alt: 'Unterkategorie Mobilität: Fahrrad'
  },
  essenausgabe: {
    label: 'Essenausgabe',
    path: 'essenausgabe',
    icon: 'mdi-pot-mix',
    svg: EssenausgabeIcon,
    alt: 'Unterkategorie Essenausgabe: dampfende Suppen-Schüssel'
  },
  futtern: {
    label: 'Futtern',
    path: 'futtern',
    icon: 'mdi-silverware-fork-knife',
    svg: FutternIcon,
    alt: 'Unterkategorie Futtern: Messer und Gabel'
  },
  werkstatt: {
    label: 'Werkstatt',
    path: 'werkstatt',
    icon: 'mdi-tools',
    svg: WerkstattIcon,
    alt: 'Unterkategorie Werkstatt: Handsäge'
  },
  /*schenken: {
    label: 'schenken',
    path: 'schenken',
    icon: 'mdi-package-variant-plus',
    svg: '/src/assets/icons/sub/Aktion_Outlines.svg'
  },*/
  spielen: {
    label: 'spielen',
    path: 'spielen',
    icon: 'mdi-cards-playing-outline',
    svg: SpielenIcon,
    alt: 'Unterkategorie spielen: sechs-seitiger Spiel-Würfel'
  },
  medien: {
    label: 'Medien',
    path: 'medien',
    icon: 'mdi-book-open-variant-outline',
    svg: MedienIcon,
    alt: 'Unterkategorie Medien: aufgeschlagenes Buch'
  },
  textilien: {
    label: 'Textilien',
    path: 'textilien',
    icon: 'mdi-tshirt-crew-outline',
    svg: TextilienIcon,
    alt: 'Unterkategorie Textilien: simples T-Shirt'
  },
  moebel: {
    label: 'Möbel',
    path: 'moebel',
    icon: 'mdi-sofa-outline',
    svg: MoebelIcon,
    alt: 'Unterkategorie Möbel: gemütlicher Sessel'
  },
  raum: {
    label: 'Raum',
    path: 'raum',
    icon: 'mdi-home-city-outline',
    svg: RaumIcon,
    alt: 'Unterkategorie Raum: Haus mit großer Eingangstür'
  },
}

export const MAIN_CATEGORIES = Object.values(CATEGORY_CONFIG)
export const SUB_CATEGORIES = Object.values(SUB_CATEGORY_CONFIG)

export const getCategoryDefinition = (key?: string | null) => {
  if (!key) return undefined
  return CATEGORY_CONFIG[key]
}

export const getSubCategoryDefinition = (key?: string | null) => {
  if (!key) return undefined
  return SUB_CATEGORY_CONFIG[key]
}
