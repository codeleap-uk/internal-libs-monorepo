import { PropsOf } from '@codeleap/types'
import { StyledProp } from '@codeleap/styles'
import { ImageStyle, TextStyle, View as RNView, ViewStyle } from 'react-native'
import { AnimatedStyleProp } from 'react-native-reanimated'
import { ViewComposition } from './styles'

export type ViewProps<T extends React.ComponentType = typeof RNView> = {
  component?: T
  style?: StyledProp<ViewComposition>
  animated?: boolean
  children?: React.ReactNode
  animatedStyle?: AnimatedStyleProp<ViewStyle | ImageStyle | TextStyle>
} & PropsOf<T>
