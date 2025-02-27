import React from 'react'
import { TypeGuards } from '@codeleap/types'
import dayjs from 'dayjs'
// @ts-ignore
import { Calendar as RNCalendar, CalendarProps as RNCalendarProps, DateData } from 'react-native-calendars'
import { View, ViewProps } from '../View'
import { CalendarComposition } from './types'
import { AnyRecord, IJSX, StyledComponentProps, StyledProp } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export type CalendarProps =
  Omit<ViewProps, 'style'> &
  {
    onValueChange?: (date: Date | string) => any
    value?: Date | string
    calendarProps?: RNCalendarProps
    style?: StyledProp<CalendarComposition>
  }

export * from './types'

export const Calendar = (props: CalendarProps) => {
  const {
    style,
    calendarProps,
    value,
    onValueChange,
    ...viewProps
  } = props

  const styles = useStylesFor(Calendar.styleRegistryName, style)

  const isDateObject = TypeGuards.isInstance(value, Date)
  const stringValue: string = isDateObject ? dayjs(value).format('YYYY/MM/DD') : value

  function handleChange(date: DateData) {
    if (!onValueChange) return
    if (isDateObject) {
      onValueChange(new Date(date.timestamp))
    } else {
      onValueChange(date.dateString)
    }
  }

  return <View style={styles?.wrapper} {...viewProps}>
    <RNCalendar
      onDayPress={handleChange}
      current={new Date(value).toISOString()}
      monthFormat={'MMMM yyyy'}
      markedDates={{
        [stringValue]: { selected: true },
      }}
      theme={{
        ...styles?.theme,
        stylesheet: styles,
      }}
      {...calendarProps}
    />
  </View>
}

Calendar.styleRegistryName = 'Calendar'
Calendar.elements = ['wrapper', 'theme', 'calendar', 'day', 'agenda', 'expandable', 'event', 'timeLabel', 'textDayStyle', 'dotStyle', 'arrowStyle', 'contentStyle', 'timelineContainer', 'line', 'verticalLine', 'nowIndicator']
Calendar.rootElement = 'wrapper'

Calendar.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Calendar as (props: StyledComponentProps<CalendarProps, typeof styles>) => IJSX
}

MobileStyleRegistry.registerComponent(Calendar)
