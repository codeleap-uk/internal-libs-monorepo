import React from 'react'
import { useState, ComponentVariants, useCodeleapContext } from '@codeleap/common'
import { DatePickerModalPresets } from './styles'
import { useCallback } from '@codeleap/common'
import { DatePickerProps } from 'react-native-date-picker'
import DatePicker from 'react-native-date-picker'
import { TextInput, TextInputPresets, TextInputProps } from '../TextInput'
import { ModalManager } from '../../utils'
import { ModalPresets } from '../Modal'

type DatePickerModalProps = {
  value?: any
  visible?: boolean
  toggle?: () => void
  minAge: number
  maxAge: number
  modalVariant?: ComponentVariants<typeof ModalPresets>['variants']
} & Partial<DatePickerProps>& ComponentVariants<typeof DatePickerModalPresets> & Partial<TextInputProps> & ComponentVariants<typeof TextInputPresets>

type NativePickerModalProps = {
  modal?: boolean
}

export * from './styles'

const GetMaxDate = (minAge: number) => {
  const now = new Date()
  const maxDate = new Date()
  maxDate.setFullYear(now.getFullYear() - minAge)
  return maxDate
}

const GetMinDate = (maxAge: number) => {
  const now = new Date()
  const minDate = new Date()
  minDate.setFullYear(now.getFullYear() - maxAge)
  return minDate
}

const FormatCurrentDate = (date: string) => new Date(date.split('/').reverse().join('-'))

export const DatePickerModal = (props: DatePickerModalProps) => {

  const { Theme } = useCodeleapContext()

  const {
    textColor,
    onConfirm,
    locale,
    mode,
    modal,
    value,
    visible,
    toggle,
    minAge,
    maxAge,
    modalVariant,
    ...textInputProps
  } = props

  const [open, setOpen] = visible && toggle ? [visible, toggle] : useState(false)

  const initialDate = new Date(1990, 0o2, 0o2)
  const date = value ? FormatCurrentDate(value) : initialDate
  const inputValue = value.split('-').reverse().join('/')

  const NativePickerModal = (params : NativePickerModalProps) => {
    const { modal } = params
    return (
      <DatePicker
        modal={!!modal}
        open={open}
        date={date}
        mode={mode || 'date'}
        textColor={textColor || Theme.colors.light.text}
        locale={locale || 'en-GB'}
        onConfirm={(date) => {
          setOpen(false)
          onConfirm(date)
        }}
        onCancel={() => setOpen(false)}
        maximumDate={GetMaxDate(minAge)}
        minimumDate={GetMinDate(maxAge)}

      />
    )
  }

  const CustomModal = useCallback((visible, toggle) => {
    return (
      <ModalManager.Modal
        variants={modalVariant}
        debugName='date picker modal manager'
        visible={visible}
        toggle={toggle}>
        <NativePickerModal />
      </ModalManager.Modal>
    )
  }, [])

  return (
    <>
      <TextInput
        debugName={'debug name'}
        value={inputValue}
        onPress={() => setOpen(true)}
        {...textInputProps}
      />

      {modal ? <CustomModal /> : <NativePickerModal modal={true} />}
    </>
  )
}

export default DatePickerModal
