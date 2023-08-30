import { ComponentVariants, PropsOf, StylesOf } from '@codeleap/common'
import { EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { View, ViewProps } from '../View'
import { ListComposition, ListPresets } from './styles'
import { motion } from 'framer-motion'
import { ActivityIndicatorProps } from '../ActivityIndicator'
import { ComponentCommonProps } from '../../types'
import { UseInfiniteScrollArgs } from './useInfiniteScroll'
import { ItemMasonryProps, ListMasonryProps } from '../../lib'

export type AugmentedRenderItemInfo<T> = ItemMasonryProps<T> & {
  item: T
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
}

export type ListProps<
T = any[],
Data = T extends Array<infer D> ? D : never
> = 
  ComponentVariants<typeof ListPresets> &
  Omit<typeof View, 'variants' | 'styles'> & {
    data: Data[]
    isFetching?: boolean
    hasNextPage?: boolean
    separators?: boolean
    onRefresh?: () => void
    placeholder?: EmptyPlaceholderProps
    styles?: StylesOf<ListComposition>
    keyExtractor?: (item: T, index: number) => string
    renderItem: (data: AugmentedRenderItemInfo<T>) => React.ReactElement
    ListFooterComponent?: () => React.ReactElement
    ListLoadingIndicatorComponent?: () => React.ReactElement
    ListRefreshControlComponent?: () => React.ReactElement
    ListEmptyComponent?: React.FC | ((props: EmptyPlaceholderProps) => React.ReactElement)
    ListSeparatorComponent?: React.FC | ((props: { separatorStyles: ViewProps<'div'>['css'] }) => React.ReactElement)
    isLoading?: boolean
    isFetchingNextPage?: boolean
    fetchNextPage?: () => void
    ListHeaderComponent?: () => React.ReactElement
    refreshDebounce?: number
    refreshSize?: number
    refreshThreshold?: number
    refreshPosition?: number
    refresh?: boolean
    refreshControlProps?: PropsOf<typeof motion.div>
    refreshControlIndicatorProps?: Partial<ActivityIndicatorProps>
    style?: React.CSSProperties
    ref?: React.MutableRefObject<undefined>
    rowItemsSpacing?: number
    overscan?: number
    masonryProps?: Partial<Omit<ListMasonryProps<T>, 'previousItemsLength'>>
    reloadTimeout?: number
} & ComponentCommonProps & UseInfiniteScrollArgs
