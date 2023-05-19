import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type RefreshControlComposition = 'loadingAnimation' |'progressBackgroundColor' | 'titleColor'

const createRefreshControlStyle = createDefaultVariantFactory<RefreshControlComposition>()

export const RefreshControlPresets = includePresets(style => createRefreshControlStyle(() => ({ loadingAnimation: style })))
