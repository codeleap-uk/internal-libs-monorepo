import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import 'react-circular-progressbar/dist/styles.css'

export type ProgressCircleComposition = 'wrapper' | 'line' | 'circle' | 'text' | 'icon' | 'text'

const createProgressCircleStyle = createDefaultVariantFactory<ProgressCircleComposition>()

export const ProgressCirclePresets = includePresets((styles) => createProgressCircleStyle(() => ({ wrapper: styles })))
