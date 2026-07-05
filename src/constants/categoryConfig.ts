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
  icon: string // mdi-icons (automatisch über Vuetify)
}

export const CATEGORY_CONFIG: Record<string, CategoryDefinition> = {
  begegnung: {
    label: 'Begegnung',
    path: 'begegnung',
    textcolor: 'var(--color-purple)', // Textfarbe
    color: 'var(--color-light-purple)', // Hintergrundfarbe
    icon: 'mdi-account-multiple-outline',
  },
  digitales: {
    label: 'Digitales',
    path: 'digitales',
    textcolor: 'var(--color-yellow)', // Textfarbe
    color: 'var(--color-light-yellow)', // Hintergrundfarbe
    icon: 'mdi-laptop',
  },
  lebensmittel: {
    label: 'Lebensmittel',
    path: 'lebensmittel',
    textcolor: 'var(--color-orange)', // Textfarbe
    color: 'var(--color-light-orange)', // Hintergrundfarbe
    icon: 'mdi-food-apple-outline',
  },
  ressourcen: {
    label: 'Ressourcen',
    path: 'ressourcen',
    textcolor: 'var(--color-green)', // Textfarbe
    color: 'var(--color-light-green)', // Hintergrundfarbe
    icon: 'mdi-recycle',
  },
}

export const SUB_CATEGORY_CONFIG: Record<string, SubCategoryDefinition> = {
  aktion: {
    label: 'Aktion',
    path: 'aktion',
    icon: 'mdi-human-handsup',
  },
  retten: {
    label: 'retten',
    path: 'retten',
    icon: 'mdi-hand-extended-outline',
  },
  mobilitaet: {
    label: 'Mobilität',
    path: 'mobilitaet',
    icon: 'mdi-bicycle-cargo',
  },
  essenausgabe: {
    label: 'Essenausgabe',
    path: 'essenausgabe',
    icon: 'mdi-pot-mix',
  },
  futtern: {
    label: 'Futtern',
    path: 'futtern',
    icon: 'mdi-silverware-fork-knife',
  },
  werkstatt: {
    label: 'Werkstatt',
    path: 'werkstatt',
    icon: 'mdi-tools',
  },
  schenken: {
    label: 'schenken',
    path: 'schenken',
    icon: 'mdi-package-variant-plus',
  },
  spielen: {
    label: 'spielen',
    path: 'spielen',
    icon: 'mdi-cards-playing-outline',
  },
  medien: {
    label: 'Medien',
    path: 'medien',
    icon: 'mdi-book-open-variant-outline',
  },
  textilien: {
    label: 'Textilien',
    path: 'textilien',
    icon: 'mdi-tshirt-crew-outline',
  },
  moebel: {
    label: 'Möbel',
    path: 'moebel',
    icon: 'mdi-sofa-outline',
  },
  raum: {
    label: 'Raum',
    path: 'raum',
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
