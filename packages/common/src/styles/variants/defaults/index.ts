// eslint-disable-next-line no-restricted-imports
import { CSSProperties } from 'react'
import { FromVariantsBuilder } from '..'
import { ButtonStyles } from './Button'
import { ContentViewStyles } from './ContentView'
import { FileInputStyles } from './FileInput'
import { ImageStyles } from './Image'
import { ModalStyles } from './Modal'
import { OverlayStyles } from './Overlay'
import { RadioInputStyles } from './RadioInput'
import { SliderStyles } from './Slider'
import { TextStyles } from './Text'
import { TextInputStyles } from './TextInput'
import { TouchableStyles } from './Touchable'
import { ViewStyles } from './View'
import { DrawerStyles } from './Drawer'
import { ActivityIndicatorStyles } from './ActivityIndicator'
import { SelectStyles } from './Select'
import { TooltipStyles } from './Tooltip'
import { CenterWrapperStyles } from './CenterWrapper'
import { RouterPageStyles } from './RouterPage'
import { AvatarStyles } from './Avatar'
import { SwitchStyles } from './Switch'
import { IconStyles } from './Icon'
import { EmptyPlaceholderStyles } from './EmptyPlaceholder'

export const DEFAULT_STYLES = {
  Button: ButtonStyles,
  View: ViewStyles,
  Checkbox: {},
  ContentView: ContentViewStyles,
  FileInput: FileInputStyles,
  Modal: ModalStyles,
  Overlay: OverlayStyles,
  RadioInput: RadioInputStyles,
  Slider: SliderStyles,
  Text: TextStyles,
  TextInput: TextInputStyles,
  Touchable: TouchableStyles,
  Icon: IconStyles,
  Image: ImageStyles,
  Drawer: DrawerStyles,
  FlatList: {},
  ActivityIndicator: ActivityIndicatorStyles,
  Select: SelectStyles,
  Tooltip: TooltipStyles,
  CenterWrapper: CenterWrapperStyles,
  Avatar: AvatarStyles,
  PageRouter: RouterPageStyles,
  Switch: SwitchStyles,
  Navigation: {},
  EmptyPlaceholder: EmptyPlaceholderStyles,
} as const

export type DEFAULT_VARIANTS = typeof DEFAULT_STYLES

export type DefaultVariants<S = CSSProperties> = {
  [Property in keyof DEFAULT_VARIANTS]: DEFAULT_VARIANTS[Property]
}

export * from './Button'
export * from './View'
export * from './ContentView'
export * from './FileInput'
export * from './Modal'
export * from './Overlay'
export * from './RadioInput'
export * from './Slider'
export * from './Text'
export * from './TextInput'
export * from './Image'
export * from './Touchable'
export * from './ActivityIndicator'
export * from './Drawer'
export * from './Select'
export * from './Tooltip'
export * from './CenterWrapper'
export * from './RouterPage'
export * from './Avatar'
export * from './Switch'
export * from './Icon'
export * from './EmptyPlaceholder'
