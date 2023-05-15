import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { IconLessInputBaseParts, InputBaseParts, InputBaseStates } from '../InputBase'

type SliderParts = InputBaseParts | 'thumb' | 'track' | 'selectedTrack' | 'unselectedTrack' | 'trackMark' | 'firstTrackMark' | 'lastTrackMark' | 'trackMarkWrapper' | 'sliderContainer' | IconLessInputBaseParts
type SliderStates = Exclude<InputBaseStates, 'focus'>

export type SliderComposition = `${SliderParts}:${SliderStates}` | SliderParts

const createSliderStyle = createDefaultVariantFactory<SliderComposition>()

export const SliderPresets = includePresets((styles) => createSliderStyle(() => ({ wrapper: styles })))
