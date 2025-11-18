import React from 'react'
import { ActionIconProps, ColorPickerComposition } from '../components'
import { AppIcon, ICSS, StyledProp } from '@codeleap/styles'
import { RgbColor, RgbaColor, HslColor, HsvColor, HslaColor, HsvaColor } from 'react-colorful'

export type ColorTypes = RgbColor | HslColor | HsvColor | RgbaColor | HslaColor | HsvaColor | string

export type ColorPickerFooterProps = Pick<ColorPickerProps, 'confirmIcon' | 'clearIcon'> & {
  color?: ColorTypes
  handleConfirmation: (value: ColorTypes) => void
  handleClear: (value: ColorTypes) => void
  styles: Record<ColorPickerComposition, ICSS>
}

export type ColorPickerPickerProps = {
  color: ColorTypes
  visible: boolean
  toggle: (v?: boolean) => void
}

export type ColorPickerProps = {
  style?: StyledProp<ColorPickerComposition>
  isPlain?: boolean
  closeOnConfirm?: boolean
  initialColor?: ColorTypes
  showFooter?: boolean
  icon?: AppIcon
  clearIcon?: AppIcon
  confirmIcon?: AppIcon
  openPickerProps?: ActionIconProps
  onConfirm?: (color: ColorTypes) => void
  onClear?: () => void
  openPickerComponent?: (props: ColorPickerPickerProps) => React.ReactElement
  pickerComponent?: (props: any) => React.ReactElement
  footerComponent?: (props: ColorPickerFooterProps) => React.ReactElement
  visible?: boolean
  toggle?: React.Dispatch<React.SetStateAction<boolean>>
  children?: React.ReactNode
}
