import React from 'react'
import { TypeGuards } from '@codeleap/common'
import { format } from 'date-fns'
// @ts-ignore
import { Calendar as RNCalendar, CalendarProps as RNCalendarProps, DateData } from 'react-native-calendars'
import { View, ViewProps } from '../View'
import { CalendarComposition } from './types'
import { AnyRecord, IJSX, StyledComponentProps, StyledProp, useStyleObserver } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'

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

  const styleObserver = useStyleObserver(style)

  const styles = React.useMemo(() => {
    return MobileStyleRegistry.current.styleFor(Calendar.styleRegistryName, style)
  }, [styleObserver])

  const isDateObject = TypeGuards.isInstance(value, Date)
  const stringValue: string = isDateObject ? format(value, 'yyyy/MM/dd') : value

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
