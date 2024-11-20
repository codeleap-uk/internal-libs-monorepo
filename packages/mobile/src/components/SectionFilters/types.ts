import { ReactElement } from 'react'
import { AugmentedSectionRenderItemInfo, SectionComponentProps, SectionProps } from '../Sections'
import { TSectionFilterItem, UseSectionFilters, useSectionFilters } from './useSectionFilters'

export type SectionFilterItemProps<T> =
  AugmentedSectionRenderItemInfo<T> &
  {
    onPress: () => void
    selected: boolean
    disabled: boolean
    text: string
  }

export type SectionFilterComponentProps<T> =
  SectionComponentProps<T> &
  {
    selectedItems: TSectionFilterItem[]
    clearSelectedItems: () => void
  }

export type SectionFiltersProps<T = any> =
  UseSectionFilters &
  Omit<SectionProps<T>, 'renderItem' | 'renderSectionFooter' | 'renderSectionHeader'> &
  {
    handle?: ReturnType<typeof useSectionFilters<T>>
    renderItem?: (props: SectionFilterItemProps<T>) => ReactElement
    renderSectionFooter?: (props: SectionFilterComponentProps<T>) => ReactElement
    renderSectionHeader?: (props: SectionFilterComponentProps<T>) => ReactElement
  }
