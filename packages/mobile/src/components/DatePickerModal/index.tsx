import React, { ReactElement } from 'react'
import { useState, ComponentVariants, useCodeleapContext, useDefaultComponentStyle, StylesOf, TypeGuards } from '@codeleap/common'
import { DatePickerModalComposition, DatePickerModalPresets } from './styles'
import { DatePickerProps } from 'react-native-date-picker'
import DatePicker from 'react-native-date-picker'
import { TextInput, TextInputPresets, TextInputProps } from '../TextInput'
import { ModalManager } from '../../utils'
import { View, Gap } from '../View'
import { Text } from '../Text'
import { Button } from '../Button'
import { ModalPresets } from '../Modal'
import { StyleSheet } from 'react-native'

export type DatePickerModalProps = {
  inputValue: string
  isCustomModal?: string
  visible?: boolean
  toggle?: () => void
  date?: Date
  setDate?: (date: Date) => void
  styles: StylesOf<DatePickerModalComposition>
  minAge: number
  maxAge: number
  modalVariant?: ComponentVariants<typeof ModalPresets>['variants']
  Header?: ReactElement
  Footer?: ReactElement
  headerTitle?: string
} & Partial<DatePickerProps>& ComponentVariants<typeof DatePickerModalPresets> & Partial<TextInputProps> & ComponentVariants<typeof TextInputPresets>

type InternalModalProps = Omit<DatePickerModalProps, 'inputValue'> & {
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
}

type CustomPickerModalHeader = {
  styles: StylesOf<DatePickerModalComposition>
  headerTitle?: string
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
  const { date, onConfirm, setOpen, setValue } = params
  setOpen(false)
  setValue?.(date)
  onConfirm(date)
}

const FormatCurrentDate = (date: string) => {
  const [day, month, year] = date.split('/')
  return new Date(+year, +month - 1, +day)
}

const NativePickerModal = (params: InternalModalProps) => {
  const { open, modal, date, mode, textColor, locale, onConfirm, onCancel, onDateChange, minAge, maxAge, theme } = params
  return (
    <DatePicker
      modal={modal}
      open={open}
      date={date}
      mode={mode}
      textColor={textColor}
      locale={locale}
      theme={theme}
      onConfirm={onConfirm}
      onDateChange={onDateChange}
      onCancel={onCancel}
      maximumDate={GetMaxDate(minAge)}
      minimumDate={GetMinDate(maxAge)}
    />
  )
}

const CustomPickerModal = (params: InternalModalProps) => {
  const { Header, Footer, modalVariant, open, onOpenModal, minAge, maxAge, ...datePickerProps } = params
  return (
    <ModalManager.Modal
      variants={modalVariant}
      debugName='date picker modal manager'
      visible={open}
      toggle={onOpenModal}
      header={Header}
      footer={Footer}
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
  const { onConfirm, onCancel, styles } = params
  return (
    <Gap style={styles.fotterButtonsWrapper} value={2} variants={['row', 'padding:2']}>
      <Button
        debugName={'custom modal footer cancel button'}
        style={styles.footerCancelButton}
        variants={['flex']}
        text={`Cancel`}
        onPress={onCancel}/>
      <Button
        debugName={'custom modal footer confirm button '}
        variants={['flex']}
        style={styles.footerConfirmButton}
        text={`Confirm`}
        onPress={onConfirm}/>
    </Gap>
  )
}

const CustomPickerModalHeader = (params: CustomPickerModalHeader) => {
  const { styles, headerTitle } = params
  return (
    <View style={styles.headerWrapper}>
      <Text style={styles.headerText} text={headerTitle || 'Date Picker Header'} />
    </View>
  )
}

export const DatePickerModal = (props: DatePickerModalProps) => {

  const { Theme } = useCodeleapContext()

  const {
    textColor,
    locale,
    mode,
    isCustomModal,
    inputValue,
    visible,
    toggle,
    date,
    setDate,
    minAge,
    maxAge,
    modalVariant,
    Header,
    Footer,
    headerTitle = '',
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

  const Modal = () => {
    const Component = isCustomModal ? CustomPickerModal : NativePickerModal
    return (
      <Component
        modal={!isCustomModal}
        open={open}
        date={value}
        textColor={textColor || Theme.colors.light.text}
        onConfirm={date => onConfirmDate({ date, onConfirm: props.onConfirm, setOpen, setValue })}
        onDateChange={date => setValue(date)}
        onCancel={onCloseModal}
        onOpenModal={onOpenModal}
        mode={mode || 'date'}
        modalVariant={modalVariant}
        locale={locale || 'en-GB'}
        maxAge={maxAge}
        minAge={minAge}
        Header={Header || <CustomPickerModalHeader styles={variantStyles} headerTitle={headerTitle} /> }
        Footer={Footer || (
          <CustomPickerModalFooter
            styles={variantStyles}
            onConfirm={() => onConfirmDate({ date: value, onConfirm: props.onConfirm, setOpen })}
            onCancel={onCloseModal}
          />
        )}
        styles={variantStyles}
      />
    )
  }

  return (
    <>
      <TextInput
        debugName={'Date of birth picker input'}
        value={inputDateValue}
        onPress={onOpenModal}
        {...textInputProps}
      />

      <Modal />

    </>
  )
}

export default DatePickerModal
