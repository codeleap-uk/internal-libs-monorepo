import { StyledProp } from '@codeleap/styles'
import { ImageStyle, TextStyle, ViewProps as RNViewProps, ViewStyle } from 'react-native'
import Animated, { AnimatedStyleProp } from 'react-native-reanimated'
import { ViewComposition } from './styles'
import { PropsOf } from '@codeleap/types'

export type ViewProps = Omit<RNViewProps, 'style'> & {
  style?: StyledProp<ViewComposition>
  animated?: boolean
  children?: React.ReactNode
  animatedStyle?: AnimatedStyleProp<ViewStyle | ImageStyle | TextStyle>
}

export type ViewAnimatedProps = ViewProps & Omit<PropsOf<typeof Animated.View>, 'style'>