import { ActivityIndicatorComposition } from '../ActivityIndicator'

export type EmptyPlaceholderComposition =
  | 'wrapper:loading'
  | `loader${Capitalize<ActivityIndicatorComposition>}`
  | 'wrapper'
  | 'title'
  | 'description'
  | 'image'
  | 'imageWrapper'
  | 'icon'

