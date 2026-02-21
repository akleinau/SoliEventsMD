import essenIcon from '../assets/category-icons/essen.svg'
import buecherIcon from '../assets/category-icons/buecher.svg'
import reparierenIcon from '../assets/category-icons/reparieren.svg'
import begegnenIcon from '../assets/category-icons/begegnen.svg'
import ressourcenIcon from '../assets/category-icons/ressourcen.svg'
import digitalIcon from '../assets/category-icons/digital.svg'

export interface CategoryDefinition {
  label: string
  path: string
  color: string
  icon: string // mdi-icons (automatisch über Vuetify)
  icon2: string // Icon aus Assets (siehe Imports oben)
}

export const CATEGORY_CONFIG: Record<string, CategoryDefinition> = {
  begegnen: {
    label: 'Begegnung',
    path: 'begegnen',
    color: '#eae2fd',
    icon: 'mdi-account-multiple-outline',
    icon2: begegnenIcon,
  },
  buecher: {
    label: 'Bücher',
    path: 'buecher',
    color: '',//'#dbebff',
    icon: 'mdi-book-open-variant-outline',
    icon2: buecherIcon,
  },
  digital: {
    label: 'Digitales',
    path: 'digital',
    color: '#dbebff',
    icon: 'mdi-laptop',
    icon2: digitalIcon,
  },
  essen: {
    label: 'Essen',
    path: 'essen',
    color: '#e1ffe1',
    icon: 'mdi-silverware-fork-knife',
    icon2: essenIcon,
  },
  reparatur: {
    label: 'Reparatur',
    path: 'reparatur',
    color: '',//'#e1ffe1',
    icon: 'mdi-tools',
    icon2: reparierenIcon,
  },
  ressourcen: {
    label: 'Ressourcen',
    path: 'ressourcen',
    color: '#FFFACD',
    icon: 'mdi-recycle',
    icon2: ressourcenIcon,
  },
}

export const MAIN_CATEGORIES = Object.values(CATEGORY_CONFIG)

export const getCategoryDefinition = (key?: string | null) => {
  if (!key) return undefined
  return CATEGORY_CONFIG[key]
}
