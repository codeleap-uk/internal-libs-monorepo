import { createDefaultVariantFactory, includePresets } from '@codeleap/common'


export type SliderComposition =
  | 'wrapper'
  | 'handle'
  | 'track'
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
