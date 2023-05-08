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
  modalVariant?: ComponentVariants<typeof ModalPresets>['variants']
  visible?: boolean
  toggle?: () => void
  textColor?: string
  locale?: string
  mode?: string
  minAge: number
  maxAge: number
} & Partial<DatePickerProps>& ComponentVariants<typeof DatePickerModalPresets> & Partial<TextInputProps> & ComponentVariants<typeof TextInputPresets>

export * from './styles'

export const DatePickerModal = (props: DatePickerModalProps) => {

  const { Theme } = useCodeleapContext()

  const {
    value,
    visible,
    toggle,
    textColor,
    minAge,
    maxAge,
    onConfirm,
    locale,
    mode,
    modal,
    modalVariant,
    ...textInputProps
  } = props

  const [open, setOpen] = visible && toggle ? [visible, toggle] : useState(false)

  const initialDate = date => new Date(date.split('/').reverse().join('-'))

  const date = value ? initialDate(value) : new Date(1990, 0o2, 0o2)

  const getMaxDate = () => {
    const now = new Date()
    const maxDate = new Date()
    maxDate.setFullYear(now.getFullYear() - minAge)
    return maxDate
  }

  const getMinDate = () => {
    const now = new Date()
    const minDate = new Date()
    minDate.setFullYear(now.getFullYear() - maxAge)
    return minDate
  }

  const NativePickerModal = () => {
    return (
      <DatePicker
        modal
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
        maximumDate={getMaxDate()}
        minimumDate={getMinDate()}

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
        value={'1980/02/02'}
        onPress={() => setOpen(true)}
        {...textInputProps}
      />

      {modal ? <CustomModal /> : <NativePickerModal />}
    </>
  )
}

export default DatePickerModal
