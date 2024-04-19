import { PropsOf } from '@codeleap/common'
import { StyledProp } from '@codeleap/styles'
import { View as RNView } from 'react-native'
import { ViewComposition } from './styles'

export type ViewProps<T extends React.ComponentType = typeof RNView> = {
  component?: T
  style?: StyledProp<ViewComposition>
  animated?: boolean
  children?: React.ReactNode
} & PropsOf<T>
