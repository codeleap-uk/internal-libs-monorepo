import { createDefaultVariantFactory, includePresets, StylesOf } from '@codeleap/common'
import { InputLabelComposition } from '../InputLabel'
import { SegmentedControlComposition, SegmentedControlStylesGen } from './types'

const createSegmentedControlStyle = createDefaultVariantFactory<
SegmentedControlComposition,
SegmentedControlStylesGen
>()

export const SegmentedControlPresets = includePresets((style) => createSegmentedControlStyle(() => ({ wrapper: style })))
