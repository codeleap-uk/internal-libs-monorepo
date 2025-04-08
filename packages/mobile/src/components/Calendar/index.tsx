import React, { useCallback } from 'react'
import { TypeGuards } from '@codeleap/types'
import { Calendar as RNCalendar, DateData } from 'react-native-calendars'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { CalendarProps } from './types'
import dayjs from 'dayjs'

export * from './styles'
export * from './types'

export const Calendar = (props: CalendarProps) => {
  const {
    style,
    value,
    onValueChange,
    parseToDate,
    ...calendarProps
  } = props

  const styles = useStylesFor(Calendar.styleRegistryName, style)

  const isDateValue = TypeGuards.isInstance(value, Date)
  const stringValue = isDateValue ? dayjs(value).format('YYYY-MM-DD') : value ?? ''

  const onChange = useCallback((date: DateData) => {
    const newValue = isDateValue || parseToDate ? dayjs(date.dateString).toDate() : date.dateString
    onValueChange?.(newValue)
  }, [onValueChange])

  return (
    <RNCalendar
      onDayPress={onChange}
      current={stringValue}
      monthFormat={'MMMM yyyy'}
      {...calendarProps}
      markedDates={{ [stringValue]: { selected: true }, ...calendarProps?.markedDates }}
      style={styles?.wrapper}
      headerStyle={styles?.header}
      theme={{
        ...styles?.calendar,
        ...calendarProps?.theme,
      }}
    />
  )
}

Calendar.styleRegistryName = 'Calendar'
Calendar.elements = ['wrapper', 'header', 'calendar']
Calendar.rootElement = 'wrapper'

Calendar.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Calendar as (props: StyledComponentProps<CalendarProps, typeof styles>) => IJSX
}

Calendar.defaultProps = {
  parseToDate: false,
} as Partial<CalendarProps>

MobileStyleRegistry.registerComponent(Calendar)
