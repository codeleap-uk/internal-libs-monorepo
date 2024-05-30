import React from 'react'
import { FormTypes, StylesOf } from '@codeleap/common'
import { DatePickerModalButtonCompositions, DatePickerModalComposition } from './styles'
import { DatePickerProps } from 'react-native-date-picker'
import { ButtonProps } from '../Button'
import { ModalProps } from '../Modal'
import { StyledProp } from '@codeleap/styles'

export type DatePickerModalOuterInputProps = Omit<DatePickerModalProps, 'outerInputComponent'> & {
  valueLabel: FormTypes.Label
}

type DatePickerModalFooterProps = Omit<DatePickerModalProps, 'outerInputComponent' | 'style'> & {
  valueLabel: FormTypes.Label
  confirm: () => void
  cancelStyles: StylesOf<DatePickerModalButtonCompositions>
  confirmStyles: StylesOf<DatePickerModalButtonCompositions>
  doneStyles: StylesOf<DatePickerModalButtonCompositions>
}

export type DatePickerModalProps =
  Omit<ModalProps, 'style' | 'ref'> &
  {
    hideInput?: boolean
    debugName: string
    value: Date
    label?: FormTypes.Label
    placeholder?: FormTypes.Label
    onValueChange: (date: Date) => void
    isCustomModal?: boolean
    mode?: DatePickerProps['mode']
    cancelButtonProps?: Partial<ButtonProps>
    confirmButtonProps?: Partial<ButtonProps>
    datePickerProps?: Partial<DatePickerProps>
    outerInputComponent?: React.ComponentType<DatePickerModalOuterInputProps>
    formatDate?: (date: Date) => FormTypes.Label
    commitDate?: 'onConfirm' | 'onChange'
    showDoneButton?: boolean
    footerComponent?: React.ComponentType<DatePickerModalFooterProps>
    initialDate?: Date
    minimumDate?: DatePickerProps['minimumDate']
    maximumDate?: DatePickerProps['maximumDate']
    toggleOnConfirm?: boolean
    onConfirm?: (value: Date) => void
    style?: StyledProp<DatePickerModalComposition>
  }
