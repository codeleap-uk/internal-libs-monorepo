import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ActivityIndicatorComposition } from '../ActivityIndicator'

type LoadingOverlayStates = 'visible'

export type LoadingOverlayParts = 'wrapper' | `indicator${Capitalize<ActivityIndicatorComposition>}`

export type LoadingOverlayComposition = `${LoadingOverlayParts}:${LoadingOverlayStates}` | LoadingOverlayParts

export const createLoadingOverlayStyle = createDefaultVariantFactory<LoadingOverlayComposition>()

export const LoadingOverlayPresets = includePresets(s => createLoadingOverlayStyle(() => ({ wrapper: s })))
