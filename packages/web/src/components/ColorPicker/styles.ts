import { PartialComponentStyle } from '@codeleap/common'
import { ActionIconComposition } from '../ActionIcon'

type ColorPickerState = 'open'
export type ColorPickerParts = 'wrapper' | 'picker' | 'dropdown' | `dropdown:${ColorPickerState}` | 'dropdownInnerWrapper' | 'footerWrapper'

export type ColorPickerComposition = {
  footerButton?: PartialComponentStyle<ActionIconComposition, any>
} & {[x in ColorPickerParts]?: any}

