// eslint-disable-next-line no-restricted-imports
import { CSSProperties } from 'react'
import { FromVariantsBuilder } from '..'
import { ButtonStyles } from './Button'
import { CheckboxStyles } from './Checkbox'
import { ContentViewStyles } from './ContentView'
import { FileInputStyles } from './FileInput'
import { ModalStyles } from './Modal'
import { OverlayStyles } from './Overlay'
import { RadioButtonStyles } from './RadioButton'
import { SliderStyles } from './Slider'
import { TextStyles } from './Text'
import { TextInputStyles } from './TextInput'
import { TouchableStyles } from './Touchable'
import { ViewStyles } from './View'

export const DEFAULT_STYLES = {
  Button: ButtonStyles,
  View: ViewStyles,
  Checkbox: CheckboxStyles,
  ContentView: ContentViewStyles,
  FileInput: FileInputStyles,
  Modal: ModalStyles,
  Overlay: OverlayStyles,
  RadioButton: RadioButtonStyles,
  Slider: SliderStyles,
  Text: TextStyles,
  TextInput: TextInputStyles,
  Touchable: TouchableStyles,
} as const

export type DEFAULT_VARIANTS = typeof DEFAULT_STYLES;

export type DefaultVariants<S = CSSProperties> = {
    [Property in keyof DEFAULT_VARIANTS]: FromVariantsBuilder<S, DEFAULT_VARIANTS[Property]>;
  };


export * from './Button'
export * from './View'
export * from './Checkbox'
export * from './ContentView'
export * from './FileInput'
export * from './Modal'
export * from './Overlay'
export * from './RadioButton'
export * from './Slider'
export * from './Text'
export * from './TextInput'
export * from './Touchable'
