import { EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { ListComposition } from './styles'
import { StyledProp } from '@codeleap/styles'
import { MasonryProps, RenderComponentProps, UseInfiniteLoaderOptions } from 'masonic'

export type AugmentedRenderItemInfo<T> = RenderComponentProps<T> & {
  item: T
}

export type ListItem = {
  id: string | number
}

export type ListProps<T extends ListItem = ListItem> =
  Omit<MasonryProps<T>, 'items' | 'render' | 'onRender'> &
  {
    data: T[]
    style?: StyledProp<ListComposition>
    placeholder?: Omit<EmptyPlaceholderProps, 'debugName'>
    ItemSeparatorComponent?: React.ReactElement
    fetchNextPage?: () => void
    renderItem: (data: AugmentedRenderItemInfo<T>) => React.ReactElement
    ListFooterComponent?: React.ReactElement | (() => React.ReactElement)
    infiniteLoaderProps?: UseInfiniteLoaderOptions<unknown>
    hasNextPage?: boolean
    separators?: boolean
  }
