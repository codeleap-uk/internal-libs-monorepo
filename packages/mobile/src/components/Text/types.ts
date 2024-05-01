import { StyledProp } from '@codeleap/styles'
import { ReactNode } from 'react'
import { TextProps as RNTextProps, Animated } from 'react-native'
import { TextComposition } from './styles'

export type TextProps =
  Omit<RNTextProps, 'style'> &
  {
    text?: ReactNode
    animated?: boolean
    colorChangeConfig?: Partial<Animated.TimingAnimationConfig>
    debugName?: string
    debounce?: number
    pressDisabled?: boolean
    style?: StyledProp<TextComposition>
  }

