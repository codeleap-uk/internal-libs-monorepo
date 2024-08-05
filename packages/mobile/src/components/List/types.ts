import { StyledProp } from '@codeleap/styles'
import { ListRenderItemInfo, FlatListProps as RNFlatListProps } from 'react-native'
import { ListComposition } from './styles'
import { EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { RefreshControlProps } from '../RefreshControl'
import { ViewProps } from '../View'

export type DataboundFlatListPropsTypes = 'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout' | 'style'

export type AugmentedRenderItemInfo<T> = ListRenderItemInfo<T> & {
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
}

export type ReplaceFlatlistProps<P, T> =
  Omit<P, DataboundFlatListPropsTypes> &
  {
    data: T[]
    keyExtractor?: (item: T, index: number) => string
    renderItem: (data: AugmentedRenderItemInfo<T>) => React.ReactElement
    onRefresh?: () => void
    getItemLayout?: ((data: T, index: number) => { length: number; offset: number; index: number })
    fakeEmpty?: boolean
    loading?: boolean
  }

export type ListItem = any

export type FlatListProps<T extends ListItem = ListItem> =
  ReplaceFlatlistProps<RNFlatListProps<T>, T> &
  Omit<ViewProps, 'style'> &
  {
    separators?: boolean
    placeholder?: EmptyPlaceholderProps
    refreshControlProps?: Partial<RefreshControlProps>
    fakeEmpty?: boolean
    loading?: boolean
    keyboardAware?: boolean
    style?: StyledProp<ListComposition>
  }
