import essenIcon from '../assets/category-icons/essen.svg'
import buecherIcon from '../assets/category-icons/buecher.svg'
import reparierenIcon from '../assets/category-icons/reparieren.svg'
import begegnungIcon from '../assets/category-icons/begegnen.svg'
import ressourcenIcon from '../assets/category-icons/ressourcen.svg'
import digitalesIcon from '../assets/category-icons/digital.svg'

export interface CategoryDefinition {
  label: string
  path: string
  color: string
  icon: string // mdi-icons (automatisch über Vuetify)
  icon2: string // Icon aus Assets (siehe Imports oben)
}

export const CATEGORY_CONFIG: Record<string, CategoryDefinition> = {
  begegnung: {
    label: 'Begegnung',
    path: 'begegnung',
    color: '#eae2fd',
    icon: 'mdi-account-multiple-outline',
    icon2: begegnungIcon,
  },
  /*buecher: {
    label: 'Bücher',
    path: 'buecher',
    color: '',//'#dbebff',
    icon: 'mdi-book-open-variant-outline',
    icon2: buecherIcon,
  },*/
  digitales: {
    label: 'Digitales',
    path: 'digitales',
    color: '#dbebff',
    icon: 'mdi-laptop',
    icon2: digitalesIcon,
  },
  lebensmittel: {
    label: 'Lebensmittel',
    path: 'lebensmittel',
    color: '#e1ffe1',
    icon: 'mdi-food-apple-outline',
    icon2: essenIcon,
  },
  /*reparatur: {
    label: 'Reparatur',
    path: 'reparatur',
    color: '#ffebd9',
    icon: 'mdi-tools',
    icon2: reparierenIcon,
  },*/
  ressourcen: {
    label: 'Ressourcen',
    path: 'ressourcen',
    color: '#FFFACD',
    icon: 'mdi-recycle',
    icon2: ressourcenIcon,
  },
}

export const SUB_CATEGORY_CONFIG: Record<string, CategoryDefinition> = {
  aktion: {
    label: 'Aktion',
    path: 'aktion',
    color: '#fcd8d8',
    icon: 'mdi-human-handsup',
    icon2: begegnungIcon,
  },
  retten: {
    label: 'retten',
    path: 'retten',
    color: '#dbebff',
    icon: 'mdi-hand-extended-outline',
    icon2: ressourcenIcon,
  },
  mobilitaet: {
    label: 'Mobilität',
    path: 'mobilitaet',
    color: '#eae2fd',
    icon: 'mdi-bicycle-cargo',
    icon2: digitalesIcon,
  },
  essen: {
    label: 'essen',
    path: 'essen',
    color: '#ffebd9',
    icon: 'mdi-silverware-fork-knife',
    icon2: essenIcon,
  },
  werkstatt: {
    label: 'Werkstatt',
    path: 'werkstatt',
    color: '#e1ffe1',
    icon: 'mdi-tools',
    icon2: reparierenIcon,
  },
  schenken: {
    label: 'schenken',
    path: 'schenken',
    color: '#FFFACD',
    icon: 'mdi-package-variant-plus',
    icon2: ressourcenIcon,
  },
  spielen: {
    label: 'spielen',
    path: 'spielen',
    color: '#FFFACD',
    icon: 'mdi-cards-playing-outline', //'mdi-dice-6-outline',
    icon2: ressourcenIcon,
  },
  medien: {
    label: 'Medien',
    path: 'medien',
    color: '#FFFACD',
    icon: 'mdi-book-open-variant-outline',
    icon2: ressourcenIcon,
  },
  textilien: {
    label: 'Textilien',
    path: 'textilien',
    color: '#FFFACD',
    icon: 'mdi-tshirt-crew-outline',
    icon2: ressourcenIcon,
  },
  moebel: {
    label: 'Möbel',
    path: 'moebel',
    color: '#FFFACD',
    icon: 'mdi-sofa-outline',
    icon2: ressourcenIcon,
  },
  raum: {
    label: 'Raum',
    path: 'raum',
    color: '#FFFACD',
    icon: 'mdi-home-city-outline',
    icon2: ressourcenIcon,
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
