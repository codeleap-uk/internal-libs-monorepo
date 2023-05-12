import React, { ReactElement } from 'react'
import { useState, ComponentVariants, useCodeleapContext, useDefaultComponentStyle, StylesOf } from '@codeleap/common'
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
  inputValue?: any
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
} & Partial<DatePickerProps>& ComponentVariants<typeof DatePickerModalPresets> & Partial<TextInputProps> & ComponentVariants<typeof TextInputPresets>

type InternalModalProps = DatePickerModalProps & {
  value?: any
  setValue?: (date: Date) => void
  setOpen: (status: boolean) => void
}

type onConfirmDateProps = {
  date: Date
  setOpen: (status: boolean) => void
  onConfirm: (date: Date) => void
}

type CustomPickerModalFooter = {
  styles: StylesOf<DatePickerModalComposition>
} & Required<onConfirmDateProps>

type CustomPickerModalHeader = {
  styles: StylesOf<DatePickerModalComposition>
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

const NativePickerModal = (params : InternalModalProps) => {
  const { open, modal, date, mode, textColor, locale, setOpen, onConfirm, minAge, maxAge, setValue, theme } = params
  return (
    <DatePicker
      modal={modal}
      open={open}
      date={date}
      mode={mode}
      textColor={textColor}
      locale={locale}
      theme={theme}
      onConfirm={(date) => onConfirmDate({ date, onConfirm, setOpen })}
      onDateChange={(date) => setValue(date)}
      onCancel={() => setOpen(false)}
      maximumDate={GetMaxDate(minAge)}
      minimumDate={GetMinDate(maxAge)}
    />
  )
}

const CustomPickerModal = (params: InternalModalProps) => {
  const { Header, date, Footer, modalVariant, open, setOpen, minAge, maxAge, ...datePickerProps } = params
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
        date={date}
        setOpen={setOpen}
        minAge={minAge}
        maxAge={maxAge}
        {...datePickerProps}
      />
    </ModalManager.Modal>
  )
}

const CustomPickerModalFooter = (params: CustomPickerModalFooter) => {
  const { date, onConfirm, setOpen, styles } = params
  return (
    <Gap style={styles.fotterButtonWrapper} value={2} variants={['row', 'padding:2']}>
      <Button
        debugName={'custom modal footer cancel button'}
        style={styles.footerCancelButton}
        variants={['flex']}
        text={`Cancel`}
        onPress={() => setOpen(false)}/>
      <Button
        debugName={'custom modal footer confirm button '}
        variants={['flex']}
        style={styles.footerConfirmButton}
        text={`Confirm`}
        onPress={() => onConfirmDate({ date, onConfirm, setOpen })}/>
    </Gap>
  )
}

const CustomPickerModalHeader = (params: CustomPickerModalHeader) => {
  const { styles } = params
  return (
    <View style={styles.headerWrapper}>
      <Text style={styles.headerText} text={`Date Picker Header`} />
    </View>
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
    variants = [],
    styles = {},
    ...textInputProps
  } = props

  const variantStyles = useDefaultComponentStyle<'u:DatePickerModal', typeof DatePickerModalPresets>('u:DatePickerModal', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })

  const [open, setOpen] = visible && toggle ? [visible, toggle] : useState(false)
  const [value, setValue] = date && setDate ? [date, setDate] : useState(FormatCurrentDate(inputValue) || new Date())

  const dateValue = inputValue.split('-').reverse().join('/')

  const Modal = () => {
    const Component = isCustomModal ? CustomPickerModal : NativePickerModal
    return (
      <Component
        modal={!isCustomModal}
        open={open}
        date={value}
        setOpen={setOpen}
        setValue={setValue}
        textColor={textColor || Theme.colors.light.text}
        onConfirm={onConfirm}
        mode={mode || 'date'}
        modalVariant={modalVariant}
        locale={locale || 'en-GB'}
        maxAge={maxAge}
        minAge={minAge}
        Header={Header || <CustomPickerModalHeader styles={variantStyles} /> }
        Footer={Footer || <CustomPickerModalFooter styles={variantStyles} date={value} onConfirm={onConfirm} setOpen={setOpen}/>}
        styles={variantStyles}
      />
    )
  }

  return (
    <>
      <TextInput
        debugName={'debug name'}
        value={dateValue}
        onPress={() => setOpen(true)}
        {...textInputProps}
      />

      <Modal />

    </>
  )
}

export default DatePickerModal
