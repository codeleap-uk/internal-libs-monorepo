import { PropsOf } from '@codeleap/types'
import { StyledProp } from '@codeleap/styles'
import { ActivityIndicator as RNActivityIndicator } from 'react-native'
import { ActivityIndicatorComposition } from './styles'

export type ActivityIndicatorProps<T extends React.ComponentType = typeof RNActivityIndicator> = {
  style?: StyledProp<ActivityIndicatorComposition>
  component?: T
} & PropsOf<T>
