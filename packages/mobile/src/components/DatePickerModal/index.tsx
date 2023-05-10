import React, { ReactElement } from 'react'
import { useState, ComponentVariants, useCodeleapContext } from '@codeleap/common'
import { DatePickerModalPresets } from './styles'
import { DatePickerProps } from 'react-native-date-picker'
import DatePicker from 'react-native-date-picker'
import { TextInput, TextInputPresets, TextInputProps } from '../TextInput'
import { ModalManager } from '../../utils'
import { ModalPresets } from '../Modal'

export type DatePickerModalProps = {
  value?: any
  visible?: boolean
  toggle?: () => void
  setOpen?: (status: boolean) => void
  minAge: number
  maxAge: number
  modalVariant?: ComponentVariants<typeof ModalPresets>['variants']
  Header?: ReactElement
  Footer?: ReactElement
}
& Partial<DatePickerProps>& ComponentVariants<typeof DatePickerModalPresets>
& Partial<TextInputProps> & ComponentVariants<typeof TextInputPresets>

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

const NativePickerModal = (params : DatePickerModalProps) => {
  const { open, date, mode, textColor, locale, setOpen, onConfirm, minAge, maxAge } = params
  return (
    <DatePicker
      modal={true}
      open={open}
      date={date}
      mode={mode}
      textColor={textColor}
      locale={locale}
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

const CustomPickerModal = (params: DatePickerModalProps) => {
  const { Header, Footer, modalVariant, open, date, setOpen, textColor, onConfirm, locale, mode, minAge, maxAge } = params
  return (
    <ModalManager.Modal
      variants={modalVariant}
      debugName='date picker modal manager'
      visible={open}
      toggle={() => setOpen(true)}
      header={Header}
      footer={Footer}
    >
      <NativePickerModal
        open={open}
        date={date}
        setOpen={setOpen}
        textColor={textColor}
        onConfirm={onConfirm}
        locale={locale}
        mode={mode}
        minAge={minAge}
        maxAge={maxAge}
      />
    </ModalManager.Modal>
  )
}

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
    Header,
    Footer,
    ...textInputProps
  } = props

  const [open, setOpen] = visible && toggle ? [visible, toggle] : useState(false)

  const initialDate = new Date(1990, 0o2, 0o2)
  const openingModalDate = value ? FormatCurrentDate(value) : initialDate
  const inputValue = value.split('-').reverse().join('/')

  const RenderModal = () => {
    const Component = modal ? CustomPickerModal : NativePickerModal
    return (
      <Component
        modal={modal}
        modalVariant={modalVariant}
        open={open}
        date={openingModalDate}
        setOpen={setOpen}
        textColor={textColor || Theme.colors.light.text}
        onConfirm={onConfirm}
        locale={locale || 'en-GB'}
        mode={mode || 'date'}
        minAge={minAge}
        maxAge={maxAge}
        Header={Header}
        Footer={Footer}
      />
    )
  }

  return (
    <>
      <TextInput
        debugName={'debug name'}
        value={inputValue}
        onPress={() => setOpen(true)}
        {...textInputProps}
      />

      <RenderModal />

    </>
  )
}

export default DatePickerModal
