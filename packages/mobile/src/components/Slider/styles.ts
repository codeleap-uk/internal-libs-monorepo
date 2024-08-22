import { PartialComponentStyle } from '@codeleap/common'
import { IconLessInputBaseParts, InputBaseStates } from '../InputBase'
import { TouchableComposition, TouchableStylesGen } from '../Touchable'

type SliderParts =
  'thumb' |
  'track' |
  'selectedTrack' |
  'unselectedTrack' |
  'trackMark' |
  'firstTrackMark' |
  'lastTrackMark' |
  'trackMarkWrapper' |
  'sliderContainer' |
  IconLessInputBaseParts

type SliderStates = Exclude<InputBaseStates, 'focus'>

export type SliderComposition = `${SliderParts}:${SliderStates}` | SliderParts | 'labelBtn' | 'descriptionBtn'

export type SliderStylesGen = {
  labelBtn: PartialComponentStyle<TouchableComposition, TouchableStylesGen>
  descriptionBtn: PartialComponentStyle<TouchableComposition, TouchableStylesGen>
}
