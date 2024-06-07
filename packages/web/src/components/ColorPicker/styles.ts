type ColorPickerState = 'open'

export type ColorPickerParts =
  'wrapper' |
  'picker' |
  'dropdown' |
  `dropdown:${ColorPickerState}` |
  'dropdownInnerWrapper' |
  'footerWrapper' |
  'clearIcon' |
  'confirmIcon'

export type ColorPickerComposition = ColorPickerParts

