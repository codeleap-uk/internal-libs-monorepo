import { PartialComponentStyle, TouchableComposition, createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { IconLessInputBaseParts, InputBaseStates } from '../InputBase'
import { TouchableStylesGen } from '../Touchable'

type SliderParts = 'thumb' | 'track' | 'selectedTrack' | 'unselectedTrack' | 'trackMark' | 'firstTrackMark' | 'lastTrackMark' | 'trackMarkWrapper' | 'sliderContainer' | IconLessInputBaseParts
type SliderStates = Exclude<InputBaseStates, 'focus'>

export type SliderComposition = `${SliderParts}:${SliderStates}` | SliderParts | 'labelBtn' | 'descriptionBtn'
export type SliderStylesGen = {
  labelBtn: PartialComponentStyle<TouchableComposition, TouchableStylesGen>
  descriptionBtn: PartialComponentStyle<TouchableComposition, TouchableStylesGen>
}
const createSliderStyle = createDefaultVariantFactory<SliderComposition>()

export const SliderPresets = includePresets((styles) => createSliderStyle(() => ({ wrapper: styles })))
