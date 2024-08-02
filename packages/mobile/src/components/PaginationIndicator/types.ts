import { StyledProp } from '@codeleap/styles'
import { PaginationIndicatorComposition } from './styles'

export type PaginationIndicatorProps = {
  isFetching?: boolean
  noMoreItemsText: JSX.Element | string | number
  hasMore?: boolean
  activityIndicator?: JSX.Element
  style?: StyledProp<PaginationIndicatorComposition>
}
