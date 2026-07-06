export interface CategoryDefinition {
  label: string
  path: string
  textcolor: string
  color: string
  icon: string // mdi-icons (automatisch über Vuetify)
}

export interface SubCategoryDefinition {
  label: string
  path: string
  color: string
  icon: string // mdi-icons (automatisch über Vuetify)
}

export const CATEGORY_CONFIG: Record<string, CategoryDefinition> = {
  begegnung: {
    label: 'Begegnung',
    path: 'begegnung',
    textcolor: '#724b9b', // Hintergrundfarbe
    color: '#e5dbeb', // Hintergrundfarbe
    icon: 'mdi-account-multiple-outline',
  },
  online: {
    label: 'Online',
    path: 'online',
    textcolor: '#ecab06', // Hintergrundfarbe
    color: '#fde7b4', // Hintergrundfarbe
    icon: 'mdi-laptop',
  },
  lebensmittel: {
    label: 'Lebensmittel',
    path: 'lebensmittel',
    textcolor: '#eb6715', // Hintergrundfarbe
    color: '#fad8c3', // Hintergrundfarbe
    icon: 'mdi-food-apple-outline',
  },
  ressourcen: {
    label: 'Ressourcen',
    path: 'ressourcen',
    textcolor: '#7da531', // Hintergrundfarbe
    color: '#e3e8ca', // Hintergrundfarbe
    icon: 'mdi-recycle',
  },
}

export const SUB_CATEGORY_CONFIG: Record<string, SubCategoryDefinition> = {
  aktion: {
    label: 'Aktion',
    path: 'aktion',
    color: '#fcd8d8',
    icon: 'mdi-human-handsup',
  },
  retten: {
    label: 'retten',
    path: 'retten',
    color: '#dbebff',
    icon: 'mdi-hand-extended-outline',
  },
  mobilitaet: {
    label: 'Mobilität',
    path: 'mobilitaet',
    color: '#eae2fd',
    icon: 'mdi-bicycle-cargo',
  },
  essenausgabe: {
    label: 'Essenausgabe',
    path: 'essenausgabe',
    color: '#ffebd9',
    icon: 'mdi-pot-mix',
  },
  futtern: {
    label: 'Futtern',
    path: 'futtern',
    color: '#ffebd9',
    icon: 'mdi-silverware-fork-knife',
  },
  werkstatt: {
    label: 'Werkstatt',
    path: 'werkstatt',
    color: '#e1ffe1',
    icon: 'mdi-tools',
  },
  schenken: {
    label: 'schenken',
    path: 'schenken',
    color: '#FFFACD',
    icon: 'mdi-package-variant-plus',
  },
  spielen: {
    label: 'spielen',
    path: 'spielen',
    color: '#FFFACD',
    icon: 'mdi-cards-playing-outline',
  },
  medien: {
    label: 'Medien',
    path: 'medien',
    color: '#FFFACD',
    icon: 'mdi-book-open-variant-outline',
  },
  textilien: {
    label: 'Textilien',
    path: 'textilien',
    color: '#FFFACD',
    icon: 'mdi-tshirt-crew-outline',
  },
  moebel: {
    label: 'Möbel',
    path: 'moebel',
    color: '#FFFACD',
    icon: 'mdi-sofa-outline',
  },
  raum: {
    label: 'Raum',
    path: 'raum',
    color: '#FFFACD',
    icon: 'mdi-home-city-outline',
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
