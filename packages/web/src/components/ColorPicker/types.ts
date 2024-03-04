import React from 'react'
import { ActionIconProps, IconProps } from '../components'
import { RgbColor, RgbaColor, HslColor, HsvColor, HslaColor, HsvaColor } from 'react-colorful'
import { ComponentVariants } from '@codeleap/common'
import { ColorPickerComposition, ColorPickerPresets } from './styles'

export type ColorTypes = RgbColor | HslColor | HsvColor | RgbaColor | HslaColor | HsvaColor | string

export type ColorPickerProps = React.PropsWithChildren<{
  styles?: ColorPickerComposition
  style?: React.CSSProperties
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
} & ComponentVariants<typeof ColorPickerPresets>>
