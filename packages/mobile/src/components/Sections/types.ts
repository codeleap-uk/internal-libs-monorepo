import { StyledProp } from '@codeleap/styles'
import { SectionsComposition } from './styles'
import { SectionListRenderItemInfo, SectionListProps as RNSectionListProps, SectionListData } from 'react-native'
import { ViewProps } from '../View'
import { EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { RefreshControlProps } from '../RefreshControl'

export type DataboundSectionListPropsTypes = 'data' | 'renderItem' | 'keyExtractor' | 'style' | 'renderSectionFooter' | 'renderSectionHeader'

export type SectionInfo = {
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
}

export type AugmentedSectionRenderItemInfo<T> = SectionListRenderItemInfo<T> & SectionInfo

export type SectionComponentProps<T> = SectionListData<T> & SectionInfo & {
  title: string
}

export type ReplaceSectionListProps<P, T> =
  Omit<P, DataboundSectionListPropsTypes> &
  {
    sections: Array<{ title: string; data: T[] }>
    keyExtractor?: (item: T, index: number) => string
    renderItem: (data: AugmentedSectionRenderItemInfo<T>) => React.ReactElement
    onRefresh?: () => void
    fakeEmpty?: boolean
    loading?: boolean
    renderSectionHeader?: (props: SectionComponentProps<T>) => React.ReactElement
    renderSectionFooter?: (props: SectionComponentProps<T>) => React.ReactElement
  }

export type SectionListProps<T = any> =
  ReplaceSectionListProps<RNSectionListProps<T>, T> &
  Omit<ViewProps, 'style'> &
  {
    separators?: boolean
    placeholder?: EmptyPlaceholderProps
    refreshControlProps?: Partial<RefreshControlProps>
    fakeEmpty?: boolean
    loading?: boolean
    keyboardAware?: boolean
    style?: StyledProp<SectionsComposition>
  }
