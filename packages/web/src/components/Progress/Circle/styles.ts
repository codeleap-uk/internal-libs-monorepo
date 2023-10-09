import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import 'react-circular-progressbar/dist/styles.css'

export type ProgressCircleComposition = 'wrapper' | 'innerWrapper' | 'line' | 'circle' | 'text' | 'icon' | 'text' | 'image' | 'label' | '__props'

const createProgressCircleStyle = createDefaultVariantFactory<ProgressCircleComposition>()

export const ProgressCirclePresets = includePresets((styles) => createProgressCircleStyle(() => ({ wrapper: styles })))
