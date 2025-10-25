import { StyledProp } from '@codeleap/styles'
import { PaginationIndicatorComposition } from './styles'

export type PaginationIndicatorProps = {
  isFetching?: boolean
  noMoreItemsText: React.ReactElement | string | number
  hasMore?: boolean
  activityIndicator?: React.ReactElement
  style?: StyledProp<PaginationIndicatorComposition>
}
