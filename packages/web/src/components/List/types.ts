import { StylesOf } from '@codeleap/common'
import { EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { ViewProps } from '../View'
import { MotionProps } from 'framer-motion'
import { ActivityIndicatorProps } from '../ActivityIndicator'
import { ComponentCommonProps } from '../../types'
import { ItemMasonryProps, ListMasonryProps, UseInfiniteScrollArgs, UseInfiniteScrollReturn } from '../../lib'
import { ListComposition } from './styles'
import { StyledProp } from '@codeleap/styles'

export type ListLayoutProps = Omit<ListProps, 'renderItem'> & UseInfiniteScrollReturn['layoutProps'] & {
  styles: StylesOf<ListComposition>
  children?: React.ReactNode
  showFooter?: boolean
}

export type ListRefreshControlComponent = Partial<ListLayoutProps> & {
  styles: StylesOf<ListComposition>
}

export type AugmentedRenderItemInfo<T> = ItemMasonryProps<T> & {
  item: T
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
}

export type ListItem = {
  id: string | number
}

export type ListProps<T extends ListItem = ListItem> =
  ComponentCommonProps &
  UseInfiniteScrollArgs &
  {
    data: T[]
    isFetching?: boolean
    hasNextPage?: boolean
    separators?: boolean
    onRefresh?: () => void
    placeholder?: Omit<EmptyPlaceholderProps, 'debugName'>
    keyExtractor?: (item: T, index: number) => string
    renderItem: (data: AugmentedRenderItemInfo<T>) => React.ReactElement
    ListFooterComponent?: (props: ListLayoutProps) => React.ReactElement
    ListLoadingIndicatorComponent?: () => React.ReactElement
    ListRefreshControlComponent?: () => React.ReactElement
    ListEmptyComponent?: React.FC | ((props: EmptyPlaceholderProps) => React.ReactElement)
    ListSeparatorComponent?: React.FC | ((props: { separatorStyles: ViewProps['style'] }) => React.ReactElement)
    isLoading?: boolean
    isFetchingNextPage?: boolean
    fetchNextPage?: () => void
    ListHeaderComponent?: () => React.ReactElement
    refreshDebounce?: number
    refreshSize?: number
    refreshThreshold?: number
    refreshPosition?: number
    refresh?: boolean
    refreshControlProps?: Partial<MotionProps>
    refreshControlIndicatorProps?: Partial<ActivityIndicatorProps>
    style?: StyledProp<ListComposition>
    ref?: React.MutableRefObject<undefined>
    rowItemsSpacing?: number
    overscan?: number
    masonryProps?: Partial<ListMasonryProps<T>>
    reloadTimeout?: number
    showFooter?: boolean
  }
