import { ActivityIndicatorComposition } from '../ActivityIndicator'

export type ButtonStates = 'disabled' | 'selected'

export type ButtonParts =
  | 'wrapper'
  | 'text'
  | 'icon'
  | 'leftIcon'
  | 'rightIcon'
  | `loader${Capitalize<ActivityIndicatorComposition>}`

export type ButtonComposition = `${ButtonParts}:${ButtonStates}` | ButtonParts

