import React from 'react'
import { ActionIconProps, ColorPickerComposition, IconProps } from '../components'
import { StyledProp } from '@codeleap/styles'
import { RgbColor, RgbaColor, HslColor, HsvColor, HslaColor, HsvaColor } from 'react-colorful'

export type ColorTypes = RgbColor | HslColor | HsvColor | RgbaColor | HslaColor | HsvaColor | string

export type ColorPickerProps = React.PropsWithChildren<{
  style?: StyledProp<ColorPickerComposition>
  isPlain?: boolean
  closeOnConfirm?: boolean
  initialColor?: ColorTypes
  showFooter?: boolean
  icon?: IconProps['name']
  clearIcon?: IconProps['name']
  confirmIcon?: IconProps['name']
  openPickerProps?: ActionIconProps
  onConfirm?: (color: ColorTypes) => void
  onClear?: () => void
  openPickerComponent?: (props: { color: ColorTypes; visible: boolean; toggle: (v?: boolean) => void }) => JSX.Element
  pickerComponent?: (props: any) => JSX.Element
  footerComponent?: (props: {color: ColorTypes; handleConfirmation: () => void; handleClear: () => void}) => JSX.Element
} 
