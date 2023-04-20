import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { IconLessInputBaseParts, InputBaseComposition, InputBaseParts, InputBaseStates } from '../InputBase'

type SliderParts = 'thumb' | 'track' | 'selectedTrack' | 'unselectedTrack' | 'trackMark' | 'firstTrackMark' | 'lastTrackMark' | 'trackMarkWrapper' | 'sliderContainer' | IconLessInputBaseParts
type SliderStates = Exclude<InputBaseStates, 'focus'>

export type SliderComposition = `${SliderParts}:${SliderStates}` | SliderParts

const createSliderStyle = createDefaultVariantFactory<SliderComposition>()

export const SliderPresets = includePresets((styles) => createSliderStyle(() => ({ wrapper: styles })))
