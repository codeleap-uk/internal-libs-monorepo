import React, { ReactElement } from 'react'
import { useState, ComponentVariants, useCodeleapContext } from '@codeleap/common'
import { DatePickerModalPresets } from './styles'
import { DatePickerProps } from 'react-native-date-picker'
import DatePicker from 'react-native-date-picker'
import { TextInput, TextInputPresets, TextInputProps } from '../TextInput'
import { ModalManager } from '../../utils'
import { Gap } from '../View'
import { Button } from '../Button'
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
} & Partial<DatePickerProps>& ComponentVariants<typeof DatePickerModalPresets> &
 Partial<TextInputProps> & ComponentVariants<typeof TextInputPresets>

type onDateChangeProps = {
  isCustomModal: boolean
  date: Date
  setDate: (date: Date) => void
}

type onConfirmDateProps = {
  date: Date
  setOpen: (status: boolean) => void
  onConfirm: (date: Date) => void
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

const onConfirmDate = (params: onConfirmDateProps) => {
  const { date, onConfirm, setOpen } = params
  setOpen(false)
  onConfirm(date)
}

const FormatCurrentDate = (date: string) => new Date(date.split('/').reverse().join('-'))

const NativePickerModal = (params : DatePickerModalProps) => {
  const { open, modal, date, mode, textColor, locale, setOpen, onConfirm, minAge, maxAge, onDateChange } = params

  return (
    <DatePicker
      modal={modal}
      open={open}
      date={date}
      mode={mode}
      textColor={textColor}
      locale={locale}
      onConfirm={(date) => onConfirmDate({ date, onConfirm, setOpen })}
      onDateChange={(date) => onDateChange(date)}
      onCancel={() => setOpen(false)}
      maximumDate={GetMaxDate(minAge)}
      minimumDate={GetMinDate(maxAge)}
    />
  )
}

const CustomPickerModal = (params: DatePickerModalProps) => {
  const { Header, Footer, modalVariant, open, setOpen, minAge, maxAge, ...datePickerProps } = params
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
        setOpen={setOpen}
        minAge={minAge}
        maxAge={maxAge}
        {...datePickerProps}
      />
    </ModalManager.Modal>
  )
}

const CustomPickerModalFooter = (params: onConfirmDateProps) => {
  const { date, onConfirm, setOpen } = params
  return (
    <Gap value={2} variants={['row', 'padding:2']}>
      <Button
        debugName={'custom modal footer cancel button'}
        variants={['flex']}
        text={`Cancel`}
        onPress={() => setOpen(false)}/>
      <Button
        debugName={'custom modal footer confirm button '}
        variants={['flex']}
        text={`Confirm`}
        onPress={() => onConfirmDate({ date, onConfirm, setOpen })}/>
    </Gap>
  )
}

export const DatePickerModal = (props: DatePickerModalProps) => {

  const { Theme } = useCodeleapContext()

  const {
    textColor,
    onConfirm,
    locale,
    mode,
    modal: isCustomModal,
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
  const [date, setDate] = useState(new Date())

  const initialDate = new Date(1990, 0o2, 0o2)
  const openingModalDate = value ? FormatCurrentDate(value) : initialDate
  const inputValue = value.split('-').reverse().join('/')

  const onDateChange = (params: onDateChangeProps) => {
    const { isCustomModal, date, setDate } = params
    if (isCustomModal) {
      setDate(date)
    }
  }

  const Modal = () => {
    const Component = isCustomModal ? CustomPickerModal : NativePickerModal
    return (
      <Component
        modal={!isCustomModal}
        modalVariant={modalVariant}
        open={open}
        date={openingModalDate}
        onDateChange={(date) => onDateChange({ isCustomModal, date, setDate })}
        setOpen={setOpen}
        textColor={textColor || Theme.colors.light.text}
        onConfirm={onConfirm}
        locale={locale || 'en-GB'}
        mode={mode || 'date'}
        minAge={minAge}
        maxAge={maxAge}
        Header={Header}
        Footer={Footer || <CustomPickerModalFooter date={date} onConfirm={onConfirm} setOpen={setOpen}/>}
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

      <Modal />

    </>
  )
}

export default DatePickerModal
