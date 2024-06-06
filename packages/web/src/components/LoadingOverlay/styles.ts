import { ActivityIndicatorComposition } from '../ActivityIndicator'

type LoadingOverlayStates = 'visible'

export type LoadingOverlayParts = 'wrapper' | `indicator${Capitalize<ActivityIndicatorComposition>}`

export type LoadingOverlayComposition = `${LoadingOverlayParts}:${LoadingOverlayStates}` | LoadingOverlayParts

