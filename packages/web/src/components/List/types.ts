import { ComponentVariants, PropsOf, StylesOf } from '@codeleap/common'
import { VirtualItem, VirtualizerOptions } from '@tanstack/react-virtual'
import { EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { ViewProps } from '../View'
import { ListComposition, ListPresets } from './styles'
import { motion } from 'framer-motion'

export type AugmentedRenderItemInfo<T> = VirtualItem & {
  item: T
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
}

export type ListProps<
T = any[],
Data = T extends Array<infer D> ? D : never
> = ComponentVariants<typeof ListPresets> &
Omit<ViewProps<'div'>, 'variants'> & {
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
  virtualizerOptions?: Partial<VirtualizerOptions<any, any>>
  refreshDebounce?: number
  refreshSize?: number
  refreshThreshold?: number
  refreshPosition?: number
  refresh?: boolean
  refreshControlProps?: PropsOf<typeof motion.div>
}
