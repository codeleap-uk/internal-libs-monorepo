import React from 'react'
import {
  PropsOf,
  useState,
  useMemo,
  getNestedStylesByKey,
  useDefaultComponentStyle,
  StylesOf,
  ComponentVariants,
  useCodeleapContext,
} from '@codeleap/common'
import { DatePickerModalComposition, DatePickerModalPresets } from './styles'
import { Button } from '../Button'
import { Text } from '../Text'
import { DatePickerProps } from 'react-native-date-picker'
import DatePicker from 'react-native-date-picker'
import { StyleSheet } from 'react-native'

type DatePickerModalProps = {
  value: any
  visible?: boolean
  label: string
  toggle?: () => void
  minAge: number
  maxAge: number
  buttonProps?: Partial<PropsOf<typeof Button>>
  labelTextProps?: Partial<PropsOf<typeof Text>>
  styles?: StylesOf<DatePickerModalComposition>
  variants?: string[]
}& Partial<DatePickerProps>& ComponentVariants<typeof DatePickerModalPresets>

export * from './styles'

export const DatePickerModal = (props: DatePickerModalProps) => {

  const { Theme } = useCodeleapContext()

  const {
    buttonProps = [],
    labelTextProps = [],
    value,
    visible,
    label,
    toggle,
    minAge,
    maxAge,
    onConfirm,
    styles,
    variants,
    ...datePickerProps
  } = props

  const [open, setOpen] = visible && toggle ? [visible, toggle] : useState(false)

  const variantStyles = useDefaultComponentStyle<'u:DatePickerModal', typeof DatePickerModalPresets>('u:DatePickerModal', {
    styles,
    variants,
    transform: StyleSheet.flatten,
  })

  const buttonStyles = useMemo(
    () => getNestedStylesByKey('button', variantStyles),
    [variantStyles],
  )

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

  return (
    <>

      <Text text={label} variants={['marginBottom:1']} {...labelTextProps} />

      <Button
        debugName={'open date picker'}
        onPress={() => setOpen(true)}
        children={<Text text={value} />}
        styles={buttonStyles}
        variants={variants}
        {...buttonProps}
      />

      <DatePicker
        modal
        open={open}
        date={date}
        mode={'date'}
        textColor={Theme.colors.light.text}
        locale={'en-GB'}
        onConfirm={(date) => {
          setOpen(false)
          onConfirm(date)
        }}
        onCancel={() => setOpen(false)}
        maximumDate={getMaxDate()}
        minimumDate={getMinDate()}
        {...datePickerProps}
      />

    </>
  )
}

export default DatePickerModal
