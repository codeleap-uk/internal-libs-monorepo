import { AnyFunction } from '@codeleap/common'
import { StyledProp } from '@codeleap/styles'
import { View as RNView, PressableProps } from 'react-native'
import { TouchableComposition } from './styles'

export type TouchableProps =
  Omit<PressableProps, 'onPress' | 'children' | 'style'> &
  {
    component?: any
    ref?: React.Ref<RNView>
    debugName: string
    activeOpacity?: number
    debugComponent?: string
    onPress?: AnyFunction
    noFeedback?: boolean
    debounce?: number
    leadingDebounce?: boolean
    setPressed?: (param: boolean) => void
    rippleDisabled?: boolean
    children?: React.ReactNode
    style?: StyledProp<TouchableComposition>
    analyticsEnabled?: boolean
    analyticsName?: string
    analyticsData?: Record<string, any>
    dismissKeyboard?: boolean
    disabled?: boolean
  }
