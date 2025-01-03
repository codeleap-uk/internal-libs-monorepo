import { StyledProp } from '@codeleap/styles'

import { ScrollComposition } from './styles'
import { RefreshControlProps } from '../RefreshControl'
import { ViewProps } from '../View'
import { ScrollView, ScrollViewProps } from 'react-native'

export type ScrollProps =
  Omit<ScrollViewProps, 'style'> &
  Omit<ViewProps, 'style'> &
  {
    onRefresh?: () => void
    refreshTimeout?: number
    changeData?: any
    keyboardAware?: boolean
    refreshing?: boolean
    refreshControlProps?: Partial<RefreshControlProps>
    debugName?: string
    style?: StyledProp<ScrollComposition>
  }

export type ScrollRef = ScrollView
