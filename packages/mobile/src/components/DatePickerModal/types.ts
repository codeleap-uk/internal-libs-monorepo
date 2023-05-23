import React from 'react'
import { ComponentVariants, StylesOf, FormTypes } from '@codeleap/common'
import { DatePickerModalComposition, DatePickerModalPresets } from './styles'
import { DatePickerProps } from 'react-native-date-picker'
import { TextInputComposition } from '../TextInput'
import { ButtonComposition, ButtonProps } from '../Button'
import { ModalProps } from '../Modal'

type DatePickerModalOuterInputProps = Omit<DatePickerModalProps, 'outerInputComponent' | 'styles'> & {
    valueLabel: FormTypes.Label
    styles?: StylesOf<TextInputComposition>
}

type DatePickerModalFooterProps = Omit<DatePickerModalProps, 'outerInputComponent' | 'styles'> & {
  valueLabel: FormTypes.Label
  styles?: Record<
    'confirm' | 'cancel' | 'done',
    StylesOf<ButtonComposition>
  >
  confirm: () => void
}

export type DatePickerModalProps = Omit<ModalProps, 'styles' | 'variants' | 'ref'> & {
  hideInput?: boolean
  debugName: string
  value?: Date

  label?: FormTypes.Label

  placeholder?: FormTypes.Label

  onValueChange?: (date: Date) => void
  
  styles?: StylesOf<DatePickerModalComposition>
  
  isCustomModal?: boolean
  mode?: DatePickerProps['mode']
  // modalProps?: Partial<ModalProps>
  
  cancelButtonProps?: Partial<ButtonProps>
  confirmButtonProps?: Partial<ButtonProps>

  datePickerProps?:  Partial<DatePickerProps>

  outerInputComponent?: React.ComponentType<DatePickerModalOuterInputProps>

  formatDate?: (date: Date) => FormTypes.Label

  commitDate?: 'onConfirm' | 'onChange'

  showDoneButton?: boolean

  footerComponent?: React.ComponentType<DatePickerModalFooterProps>


} & ComponentVariants<typeof DatePickerModalPresets>