import { ActivityIndicatorComposition } from '../ActivityIndicator'

type WrapperStates = 'hidden' | 'visible'

export type LoadingOverlayComposition =
  'wrapper' |
  `wrapper:${WrapperStates}` |
  'wrapper:transition' |
  `loader${Capitalize<ActivityIndicatorComposition>}` |
  'transition'
