import React, { ReactElement } from 'react'
import { useState, ComponentVariants, useCodeleapContext, useDefaultComponentStyle, StylesOf, TypeGuards } from '@codeleap/common'
import { DatePickerModalComposition, DatePickerModalPresets } from './styles'
import { DatePickerProps } from 'react-native-date-picker'
import DatePicker from 'react-native-date-picker'
import { TextInput, TextInputPresets, TextInputProps } from '../TextInput'
import { ModalManager } from '../../utils'
import { Gap } from '../View'
import { Button, ButtonProps } from '../Button'
import { ModalProps } from '../Modal'
import { StyleSheet } from 'react-native'

export type DatePickerModalProps = {
  inputValue: string
  hideInput?: boolean
  visible?: boolean
  toggle?: () => void
  date?: Date
  setDate?: (date: Date) => void
  styles: StylesOf<DatePickerModalComposition>
  minAge: number
  maxAge: number
  Header?: ReactElement
  Footer?: ReactElement
  headerTitle?: string
  isCustomModal?: string
  modalProps?: Partial<ModalProps>
  cancelButtonProps?: Partial<ButtonProps>
  confirmButtonProps?: Partial<ButtonProps>
} & Partial<DatePickerProps>& ComponentVariants<typeof DatePickerModalPresets> &
Partial<TextInputProps> & ComponentVariants<typeof TextInputPresets>

type InternalDatePickerProps = Omit<DatePickerModalProps, 'inputValue'> & {
  onOpenModal?: () => void
}

type onConfirmDateProps = {
  date: Date
  setOpen: (status: boolean) => void
  setValue?: (value: Date) => void
  onConfirm: (date: Date) => void
}

type CustomPickerModalFooter = {
  styles: StylesOf<DatePickerModalComposition>
  onConfirm: () => void
  onCancel: () => void
} & Pick <DatePickerModalProps, 'cancelButtonProps' | 'confirmButtonProps'>

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
  const { date, onConfirm, setOpen, setValue } = params
  setOpen(false)
  setValue?.(date)
  onConfirm(date)
}

const FormatCurrentDate = (date: string) => {
  const [day, month, year] = date.split('/')
  return new Date(+year, +month - 1, +day)
}

const NativePickerModal = (params: InternalDatePickerProps) => {

  const {
    open,
    modal,
    date, mode,
    textColor,
    locale,
    onConfirm,
    onCancel,
    onDateChange,
    minAge,
    maxAge,
    theme,
    androidVariant,
    minuteInterval,
  } = params

  return (
    <DatePicker
      modal={modal}
      open={open}
      date={date}
      mode={mode}
      textColor={textColor}
      locale={locale}
      theme={theme}
      androidVariant={androidVariant}
      minuteInterval={minuteInterval}
      onConfirm={onConfirm}
      onDateChange={onDateChange}
      onCancel={onCancel}
      maximumDate={GetMaxDate(minAge)}
      minimumDate={GetMinDate(maxAge)}
    />
  )
}

const CustomPickerModal = (params: InternalDatePickerProps) => {
  const { Header, Footer, open, onOpenModal, minAge, maxAge, modalProps, ...datePickerProps } = params
  return (
    <ModalManager.Modal
      debugName='date picker modal manager'
      visible={open}
      toggle={onOpenModal}
      title={'Select Date'}
      variants={'datePickerModal'}
      header={Header}
      footer={Footer}
      {...modalProps}
    >
      <NativePickerModal
        minAge={minAge}
        maxAge={maxAge}
        {...datePickerProps}
      />
    </ModalManager.Modal>
  )
}

const CustomPickerModalFooter = (params: CustomPickerModalFooter) => {
  const { onConfirm, onCancel, cancelButtonProps, confirmButtonProps, styles } = params
  return (
    <Gap value={2} variants={['row']} style={styles.fotterButtonsWrapper}>
      <Button
        debugName={'custom modal footer cancel button'}
        style={styles.footerCancelButton}
        variants={['flex']}
        text={`Cancel`}
        onPress={onCancel}
        {...cancelButtonProps}
      />
      <Button
        debugName={'custom modal footer confirm button '}
        variants={['flex']}
        style={styles.footerConfirmButton}
        text={`Confirm`}
        onPress={onConfirm}
        {...confirmButtonProps}
      />
    </Gap>
  )
}

export const DatePickerModal = (props: DatePickerModalProps) => {

  const { Theme } = useCodeleapContext()

  const {
    textColor,
    locale,
    mode,
    theme,
    androidVariant,
    minuteInterval,
    isCustomModal,
    inputValue,
    hideInput,
    visible,
    toggle,
    date,
    setDate,
    minAge,
    maxAge,
    Header,
    Footer,
    modalProps = {},
    cancelButtonProps = {},
    confirmButtonProps = {},
    variants = [],
    styles = {},
    ...textInputProps
  } = props

  const variantStyles = useDefaultComponentStyle<'u:DatePickerModal', typeof DatePickerModalPresets>('u:DatePickerModal', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })

  const inputDateValue = inputValue.split('-').reverse().join('/')

  const [open, setOpen] = !TypeGuards.isNil(visible) && !!toggle ? [visible, toggle] : useState(false)
  const [value, setValue] = date && setDate ? [date, setDate] : useState(FormatCurrentDate(inputDateValue))

  const onOpenModal = () => setOpen(true)
  const onCloseModal = () => setOpen(false)

  const pickerTextColor = textColor ?? Theme.colors.light.text
  const pickerMode = mode ?? 'date'
  const pickerLocale = locale || 'en-GB'

  const pickerFooter = Footer ?? (
    <CustomPickerModalFooter
      styles={variantStyles}
      onConfirm={() => onConfirmDate({ date: value, onConfirm: props.onConfirm, setOpen })}
      onCancel={onCloseModal}
      cancelButtonProps={cancelButtonProps}
      confirmButtonProps={confirmButtonProps}
    />
  )

  const Modal = () => {
    const Component = isCustomModal ? CustomPickerModal : NativePickerModal
    return (
      <Component
        modal={!isCustomModal}
        open={open}
        date={value}
        textColor={pickerTextColor}
        onConfirm={date => onConfirmDate({ date, onConfirm: props.onConfirm, setOpen, setValue })}
        onDateChange={date => setValue(date)}
        onCancel={onCloseModal}
        onOpenModal={onOpenModal}
        mode={pickerMode}
        theme={theme}
        androidVariant={androidVariant}
        minuteInterval={minuteInterval}
        modalProps={modalProps}
        locale={pickerLocale}
        maxAge={maxAge}
        minAge={minAge}
        Header={Header}
        Footer={pickerFooter}
        styles={variantStyles}
      />
    )
  }

  return (
    <>
      {!hideInput && <TextInput
        debugName={'Date of birth picker input'}
        value={inputDateValue}
        onPress={onOpenModal}
        {...textInputProps}
      />}

      <Modal />

    </>
  )
}

export default DatePickerModal
