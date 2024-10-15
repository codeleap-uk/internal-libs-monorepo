import { StyledProp } from '@codeleap/styles'
import { ReactNode } from 'react'
import { TextProps as RNTextProps, Animated, ViewStyle, ImageStyle, TextStyle, Text as NativeText } from 'react-native'
import { AnimatedStyleProp } from 'react-native-reanimated'
import { TextComposition } from './styles'

export type TextProps =
  Omit<RNTextProps, 'style' | 'ref'> &
  {
    text?: ReactNode
    animated?: boolean
    colorChangeConfig?: Partial<Animated.TimingAnimationConfig>
    debugName?: string
    debounce?: number
    pressDisabled?: boolean
    style?: StyledProp<TextComposition>
    animatedStyle?: AnimatedStyleProp<ViewStyle | ImageStyle | TextStyle>
    ref?: React.ForwardedRef<NativeText>
  }
