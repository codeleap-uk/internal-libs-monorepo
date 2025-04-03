import { StyledProp } from '@codeleap/styles'
import { CalendarProps as RNCalendarProps } from 'react-native-calendars'
import { CalendarComposition } from './styles'

export type CalendarProps =
  Omit<RNCalendarProps, 'style'> &
  {
    onValueChange?: (date: Date | string) => void
    value?: Date | string
    style?: StyledProp<CalendarComposition>
  }