export interface CategoryDefinition {
  label: string
  path: string
  color: string
  icon: string // mdi-icons (automatisch über Vuetify)
}

export const CATEGORY_CONFIG: Record<string, CategoryDefinition> = {
  begegnung: {
    label: 'Begegnung',
    path: 'begegnung',
    color: '#eae2fd',
    icon: 'mdi-account-multiple-outline',
  },
  digitales: {
    label: 'Digitales',
    path: 'digitales',
    color: '#dbebff',
    icon: 'mdi-laptop',
  },
  lebensmittel: {
    label: 'Lebensmittel',
    path: 'lebensmittel',
    color: '#e1ffe1',
    icon: 'mdi-food-apple-outline',
  },
  ressourcen: {
    label: 'Ressourcen',
    path: 'ressourcen',
    color: '#FFFACD',
    icon: 'mdi-recycle',
  },
}

export const SUB_CATEGORY_CONFIG: Record<string, CategoryDefinition> = {
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
  essen: {
    label: 'essen',
    path: 'essen',
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
