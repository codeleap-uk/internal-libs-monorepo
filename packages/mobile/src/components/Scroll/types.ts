import { StyledProp } from '@codeleap/styles'
import { KeyboardAwareScrollView, KeyboardAwareScrollViewProps } from 'react-native-keyboard-aware-scroll-view'
import { ScrollComposition } from './styles'
import { RefreshControlProps } from '../RefreshControl'
import { ViewProps } from '../View'

export type ScrollProps =
  Omit<KeyboardAwareScrollViewProps, 'style'> &
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

export type ScrollRef = KeyboardAwareScrollView
