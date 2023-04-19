import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { ActivityIndicatorComposition } from '../ActivityIndicator'

type WrapperStates = 'hidden'| 'visible'

export type LoadingOverlayComposition = 'wrapper' | `wrapper:${WrapperStates}` | 'wrapper:transition' | `loader${Capitalize<ActivityIndicatorComposition>}` | 'transition'

const createLoadingOverlayStyle = createDefaultVariantFactory<LoadingOverlayComposition>()

export const LoadingOverlayPresets = includePresets((styles) => createLoadingOverlayStyle(() => ({ wrapper: styles })))
