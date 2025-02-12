import React from 'react'
import { StylesOf } from '@codeleap/types'
import { DatePickerModalButtonCompositions, DatePickerModalComposition } from './styles'
import { DatePickerProps } from 'react-native-date-picker'
import { ButtonProps } from '../Button'
import { ModalProps } from '../Modal'
import { StyledProp } from '@codeleap/styles'
import { DateField } from '@codeleap/form'

export type DatePickerModalOuterInputProps = Omit<DatePickerModalProps, 'outerInputComponent' | 'field'> & {
  valueLabel: string
  value: Date
  onValueChange: (date: Date) => void
}

type DatePickerModalFooterProps = Omit<DatePickerModalProps, 'outerInputComponent' | 'style'> & {
  valueLabel: string
  confirm: () => void
  cancelStyles: StylesOf<DatePickerModalButtonCompositions>
  confirmStyles: StylesOf<DatePickerModalButtonCompositions>
  doneStyles: StylesOf<DatePickerModalButtonCompositions>
}

export type DatePickerModalProps =
  Omit<ModalProps, 'style' | 'ref'> &
  {
    field?: DateField<any>
    hideInput?: boolean
    debugName: string
    label?: string
    placeholder?: string
    isCustomModal?: boolean
    mode?: DatePickerProps['mode']
    cancelButtonProps?: Partial<ButtonProps>
    confirmButtonProps?: Partial<ButtonProps>
    datePickerProps?: Partial<DatePickerProps>
    outerInputComponent?: React.ComponentType<DatePickerModalOuterInputProps>
    formatDate?: (date: Date) => string
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
