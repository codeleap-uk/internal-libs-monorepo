import { ActivityIndicatorComposition } from '../ActivityIndicator'

export type SortablePhotosComposition =
  'wrapper' |
  'wrapper:loading' |
  'photoWrapper' |
  'photoEmptyIcon' |
  'photoImage' |
  `loader${Capitalize<ActivityIndicatorComposition>}`
