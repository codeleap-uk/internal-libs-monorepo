import { StyledProp } from '@codeleap/styles'
import { ScrollComposition } from './styles'
import { RefreshControlProps } from '../RefreshControl'
import { ScrollView, ScrollViewProps } from 'react-native'
import { KeyboardAwareScrollViewProps } from 'react-native-keyboard-controller'

export type ScrollProps =
  Omit<ScrollViewProps, 'style'> &
  Omit<KeyboardAwareScrollViewProps, 'style'> &
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
