import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { InputLabelComposition } from '../InputLabel'

export type SliderComposition =
  | 'wrapper'
  | 'handle'
  | 'track'
  | `label${Capitalize<InputLabelComposition>}`
  | 'selectedTrack'
  | 'inputContainer'
  | 'tooltip'
  | 'tooltip:visible'
  | 'tooltip:hidden'
  | 'trackLabels'
  | 'mark'
  | 'tooltipArrow'
  | 'tooltipText'

const createSliderStyle = createDefaultVariantFactory<SliderComposition>()

export const SliderPresets = includePresets((styles) => createSliderStyle(() => ({ wrapper: styles })))
