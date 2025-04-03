import { StyledProp } from '@codeleap/styles'
import { CalendarInputComposition } from './styles'
import { CalendarProps } from '../Calendar'
import { TextInputProps } from '../TextInput'
import { DateField } from '@codeleap/form'

export type CalendarInputProps =
  Omit<TextInputProps, 'value' | 'onValueChange' | 'field' | 'style'> &
  {
    value?: CalendarProps['value']
    onValueChange?: CalendarProps['onValueChange']
    style?: StyledProp<CalendarInputComposition>
    disabled?: boolean
    gap?: number
    field?: DateField<any>
    format?: string
    overlay?: boolean

    /**
      * Defines the position where the calendar will be anchored relative to the input.
    */
    calendarPosition?: 'left' | 'right'

    /**
      * If `true`, this calendar is part of a globally managed group.
      * When one calendar in this group opens, all others with `autoClosePeersCalendars: true` will close.
    */
    autoClosePeersCalendars?: boolean
  }