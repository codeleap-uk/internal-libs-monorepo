import React, { useCallback, useMemo } from 'react'
import { TypeGuards } from '@codeleap/types'
import { Calendar as RNCalendar, DateData } from 'react-native-calendars'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { CalendarProps } from './types'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

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
  const isDateRange = Array.isArray(value)

  const stringValue = useMemo(() => {
    if (isDateRange) {
      return value.map(date => 
        isDateValue ? dayjs.utc(date).format('YYYY-MM-DD') : date ?? ''
      )
    }

    return isDateValue ? dayjs.utc(value).format('YYYY-MM-DD') : value ?? ''
  }, [value])

  const markedDates = useMemo(() => {
    if (isDateRange && Array.isArray(stringValue)) {
      if (stringValue.length === 0) return {}
      if (stringValue.length === 1) {
        const [start] = [...stringValue]

        const dateStr = dayjs(start).format('YYYY-MM-DD')

        return { [dateStr]: { selected: true } }
      }
      
      const [start, end] = [...stringValue]
      const startDate = dayjs(start)
      const endDate = dayjs(end)
      
      const markedDates: Record<string, any> = {}
      
      let currentDate = startDate

      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
        const dateStr = currentDate.format('YYYY-MM-DD')

        markedDates[dateStr] = {
          selected: true,
          ...(currentDate.isSame(startDate) && { startingDay: true }),
          ...(currentDate.isSame(endDate) && { endingDay: true })
        }
        
        currentDate = currentDate.add(1, 'day')
      }
      
      return markedDates
    }
    
    return { [stringValue as string]: { selected: true } }
  }, [stringValue])

  const onChange = useCallback((date: DateData) => {
    if (isDateRange) {
      const newValue = Array.isArray(value) ? [...value] : []
      let newDates: any = []
      
      if (newValue.length === 0 || newValue.length === 2) {
        newDates = [date.dateString]
      } else if (newValue.length === 1) {
        const firstDate = newValue[0]
        const secondDate = date.dateString
        
        if (dayjs(firstDate).isAfter(dayjs(secondDate))) {
          newDates = [secondDate, firstDate]
        } else {
          newDates = [firstDate, secondDate]
        }
      }
      
      const parsedDates = isDateValue || parseToDate ? 
        newDates.map(d => dayjs(d).toDate()) : 
        newDates
      
      onValueChange?.(parsedDates)
    } else {
      const newValue = isDateValue || parseToDate ? dayjs(date.dateString).toDate() : date.dateString
      onValueChange?.(newValue)
    }
  }, [onValueChange, value])

  const currentValue = useMemo(() => {
    return isDateRange ? (Array.isArray(stringValue) ? stringValue[0] : '') : stringValue
  }, [stringValue])
  
  return (
    <RNCalendar
      onDayPress={onChange}
      current={currentValue}
      monthFormat={'MMMM yyyy'}
      {...calendarProps}
      markedDates={{
        ...markedDates,
        ...calendarProps?.markedDates
      }}
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