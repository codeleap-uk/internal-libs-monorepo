import { StyledProp } from '@codeleap/styles'
import { CalendarProps as RNCalendarProps } from 'react-native-calendars'
import { CalendarComposition } from './styles'

export type CalendarValue = (string | string[]) | (Date | Date[])

export type CalendarProps =
  Omit<RNCalendarProps, 'style'> &
  {
    onValueChange: (date: CalendarValue) => void
    value: CalendarValue
    style?: StyledProp<CalendarComposition>
    parseToDate?: boolean
  }