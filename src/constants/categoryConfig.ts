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
  icon: string
}

export const CATEGORY_CONFIG: Record<string, CategoryDefinition> = {
  begegnen: {
    label: 'Begegnen',
    path: 'begegnen',
    color: '#fcd8d8',
    icon: begegnenIcon,
  },
  buecher: {
    label: 'Bücher',
    path: 'buecher',
    color: '#dbebff',
    icon: buecherIcon,
  },
  digital: {
    label: 'Digital',
    path: 'digital',
    color: '#eae2fd',
    icon: digitalIcon,
  },
  essen: {
    label: 'Essen',
    path: 'essen',
    color: '#ffebd9',
    icon: essenIcon,
  },
  reparatur: {
    label: 'Reparatur',
    path: 'reparatur',
    color: '#e1ffe1',
    icon: reparierenIcon,
  },
  ressourcen: {
    label: 'Ressourcen',
    path: 'ressourcen',
    color: '#FFFACD',
    icon: ressourcenIcon,
  },
}

export const MAIN_CATEGORIES = Object.values(CATEGORY_CONFIG)

export const getCategoryDefinition = (key?: string | null) => {
  if (!key) return undefined
  return CATEGORY_CONFIG[key]
}
