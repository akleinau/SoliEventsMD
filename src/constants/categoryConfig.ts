import essenIcon from '../assets/category-icons/essen.svg'
import buecherIcon from '../assets/category-icons/buecher.svg'
import reparierenIcon from '../assets/category-icons/reparieren.svg'
import begegnenIcon from '../assets/category-icons/begegnen.svg'
import ressourcenIcon from '../assets/category-icons/ressourcen.svg'
import digitalIcon from '../assets/category-icons/digital.svg'

export interface CategoryDefinition {
  label: string
  value: string
  color: string
  icon: string
}

export const CATEGORY_CONFIG: Record<string, CategoryDefinition> = {
  Essen: {
    label: 'Essen',
    value: 'Essen',
    color: '#ffebd9',
    icon: essenIcon,
  },
  Bücher: {
    label: 'Bücher',
    value: 'Bücher',
    color: '#dbebff',
    icon: buecherIcon,
  },
  Reparieren: {
    label: 'Reparieren',
    value: 'Reparieren',
    color: '#e1ffe1',
    icon: reparierenIcon,
  },
  Begegnen: {
    label: 'Begegnen',
    value: 'Begegnen',
    color: '#fcd8d8',
    icon: begegnenIcon,
  },
  Ressourcen: {
    label: 'Ressourcen',
    value: 'Ressourcen',
    color: '#FFFACD',
    icon: ressourcenIcon,
  },
  Digital: {
    label: 'Digital',
    value: 'Digital',
    color: '#eae2fd',
    icon: digitalIcon,
  },
}

export const MAIN_CATEGORIES = Object.values(CATEGORY_CONFIG)

export const getCategoryDefinition = (key?: string | null) => {
  if (!key) return undefined
  return CATEGORY_CONFIG[key]
}
