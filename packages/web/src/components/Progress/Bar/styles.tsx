import { createDefaultVariantFactory, includePresets } from '@codeleap/common'

export type ProgressBarComposition = 'wrapper' | 'progress' | 'indicator' | 'text' | 'icon' | 'leftIcon' | 'leftText' | 'rightIcon' | 'rightText'

const createProgressBarStyle = createDefaultVariantFactory<ProgressBarComposition>()

export const ProgressBarPresets = includePresets((styles) => createProgressBarStyle(() => ({ wrapper: styles })))
