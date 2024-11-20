import { createContext, useContext } from 'react'
import { SectionFiltersProps } from './types'
import { TSectionFilterItem, useSectionFilters } from './useSectionFilters'

export type SectionFiltersContextProps<T = TSectionFilterItem> = React.PropsWithChildren<SectionFiltersProps<T> & {
  handle?: ReturnType<typeof useSectionFilters<T>>
}>

type TSectionFiltersContext<T = TSectionFilterItem> = ReturnType<typeof useSectionFilters<T>>

export const SectionsFilterContext = createContext({} as TSectionFiltersContext)

export function useSectionFiltersContext<T = TSectionFilterItem>() {
  return useContext(SectionsFilterContext) as TSectionFiltersContext<T>
}
