import React, { useCallback, useMemo } from 'react'
import { Calendar as RNCalendar, DateData } from 'react-native-calendars'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { CalendarProps } from './types'
import dayjs, { Dayjs } from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { dateUtils } from '@codeleap/utils'

dayjs.extend(isSameOrBefore)

export * from './styles'
export * from './types'

const DATE_FORMAT = 'YYYY-MM-DD'

export const Calendar = (props: CalendarProps) => {
  const {
    style,
    value,
    onValueChange,
    ...calendarProps
  } = props

  const styles = useStylesFor(Calendar.styleRegistryName, style)

  const isRange = Array.isArray(value)

  const stringValue = useMemo(() => {
    if (!value) return isRange ? [] : ''

    if (isRange) {
      return (value as any).map((v) => dateUtils.removeTimezoneAndFormat(v, DATE_FORMAT))
    }

    return dateUtils.removeTimezoneAndFormat(value, DATE_FORMAT)
  }, [value, isRange])

  const markedDates = useMemo(() => {
    if (!isRange) {
      return stringValue ? { [stringValue as string]: { selected: true } } : {}
    }

    const rangeValues = stringValue as string[]
    if (rangeValues.length === 0) return {}

    if (rangeValues.length === 1) {
      return { [rangeValues[0]]: { selected: true } }
    }

    const [start, end] = rangeValues
    const startDate = dayjs(start)
    const endDate = dayjs(end)
    const marked: Record<string, any> = {}
    let current = startDate

    while (current.isSameOrBefore(endDate)) {
      const dateStr = dateUtils.removeTimezoneAndFormat(current, DATE_FORMAT)
      marked[dateStr] = {
        selected: true,
        ...(current.isSame(startDate) && { startingDay: true }),
        ...(current.isSame(endDate) && { endingDay: true }),
      }
      current = current.add(1, 'day')
    }

    return marked
  }, [stringValue, isRange])

  const handleDateChange = useCallback((date: DateData) => {
    if (!onValueChange) return

    const selected = dayjs(date.dateString).startOf('day')

    if (isRange) {
      const current = Array.isArray(value) ? value : []
      let newDates: Dayjs[] = []

      if (current.length === 0 || current.length === 2) {
        newDates = [selected]
      } else if (current.length === 1) {
        const first = dayjs(current[0]).startOf('day')
        newDates = first.isAfter(selected) 
          ? [selected, first] 
          : [first, selected]
      }

      onValueChange(newDates)
    } else {
      onValueChange(selected)
    }
  }, [onValueChange, value, isRange])

  const currentValue = useMemo(() => {
    return isRange 
      ? (Array.isArray(stringValue) ? stringValue[0] : '') 
      : stringValue
  }, [stringValue, isRange])

  return (
    <RNCalendar
      onDayPress={handleDateChange}
      current={currentValue as string}
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

Calendar.defaultProps = {} as Partial<CalendarProps>

MobileStyleRegistry.registerComponent(Calendar)