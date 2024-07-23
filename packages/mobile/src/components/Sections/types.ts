import { StyledProp } from '@codeleap/styles'
import { SectionListRenderItemInfo } from 'react-native'
import { SectionsComposition } from './styles'
import { SectionListProps as RNSectionListProps } from 'react-native'
import { ViewProps } from '../View'
import { EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { RefreshControlProps } from '../RefreshControl'

export type DataboundSectionListPropsTypes = 'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout' | 'style'

export type AugmentedSectionRenderItemInfo<T> = SectionListRenderItemInfo<T> & {
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
}

export type ReplaceSectionListProps<P, T> = Omit<P, DataboundSectionListPropsTypes> & {
  sections: T[]
  keyExtractor?: (item: T, index: number) => string
  renderItem: (data: AugmentedSectionRenderItemInfo<T>) => React.ReactElement
  onRefresh?: () => void
  getItemLayout?: ((data: T, index: number) => { length: number; offset: number; index: number })
  fakeEmpty?: boolean
}

export type SectionListProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> =
  ReplaceSectionListProps<RNSectionListProps<Data>, Data> &
  Omit<ViewProps, 'style'> &
  {
    separators?: boolean
    placeholder?: EmptyPlaceholderProps
    refreshControlProps?: Partial<RefreshControlProps>
    fakeEmpty?: boolean
    keyboardAware?: boolean
    style?: StyledProp<SectionsComposition>
  }
