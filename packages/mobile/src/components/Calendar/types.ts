import { StyledProp } from '@codeleap/styles'
import { CalendarProps as RNCalendarProps } from 'react-native-calendars'
import { CalendarComposition } from './styles'
import { Dayjs } from 'dayjs'

export type CalendarValue = Dayjs | Dayjs[]

export type CalendarProps =
  Omit<RNCalendarProps, 'style'> &
  {
    onValueChange: (date: CalendarValue) => void
    value: CalendarValue
    style?: StyledProp<CalendarComposition>
  }