import React from 'react'
import { ComponentVariants, PropsOf, TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import { StyleSheet } from 'react-native'
import { format, formatISO } from 'date-fns'
// @ts-ignore
import { Calendar as RNCalendar, CalendarProps as RNCalendarProps, DateData } from 'react-native-calendars'

import { View } from '../View'
import { CalendarStyles } from './style'
import { TCalendarStyles } from './types'
export type CalendarProps = PropsOf<typeof View> & {
  styles?: TCalendarStyles
  onValueChange?: (date: Date|string) => any
  value?: Date|string
  calendarProps?: RNCalendarProps
} & ComponentVariants<typeof CalendarStyles>
export * from './style'
export * from './types'

export const Calendar = (props:CalendarProps) => {
  const {
    variants = [],
    style,
    styles = {},
    calendarProps,
    value,
    onValueChange,
    ...viewProps
  } = props
  const variantStyles = useDefaultComponentStyle<'u:Calendar', typeof CalendarStyles>('u:Calendar', {
    variants,
    styles,
    transform: StyleSheet.flatten,
    rootElement: 'wrapper',
  })
  const isDateObject = TypeGuards.isInstance(value, Date)
  const stringValue:string = isDateObject ? format(value, 'yyyy/MM/dd') : value

  function handleChange(date:DateData) {
    if (!onValueChange) return
    if (isDateObject) {
      onValueChange(new Date(date.timestamp))
    } else {
      onValueChange(date.dateString)
    }
  }

  return <View style={[variantStyles.wrapper, style]} {...viewProps}>
    <RNCalendar
      onDayPress={handleChange}
      current={new Date(value).toISOString()}
      monthFormat={'MMMM yyyy'}
      markedDates={{
        [stringValue]: { selected: true },
      }}
      theme={{
        ...variantStyles.theme,
        stylesheet: {
          ...variantStyles,
        },
      }}
      {...calendarProps}
    />
  </View>
}
