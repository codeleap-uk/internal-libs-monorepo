import { ActivityIndicatorComposition } from '../ActivityIndicator'
import { ButtonComposition } from '../Button'

export type EmptyPlaceholderComposition =
  | 'wrapper'
  | 'wrapper:loading'
  | 'title'
  | 'description'
  | 'image'
  | 'icon'
  | `button${Capitalize<ButtonComposition>}`
  | `loader${Capitalize<ActivityIndicatorComposition>}`
