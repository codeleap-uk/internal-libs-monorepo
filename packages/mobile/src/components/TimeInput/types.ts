import { StyledProp } from '@codeleap/styles'
import { TimeInputComposition } from './styles'
import { DateField } from '@codeleap/form'
import { TextInputProps } from '../TextInput'

export type TimeInputProps =
  Omit<TextInputProps, 'value' | 'onValueChange' | 'field' | 'style'> &
  {
    value?: Date
    onValueChange?: (value: Date) => void
    style?: StyledProp<TimeInputComposition>
    disabled?: boolean
    gap?: number
    field?: DateField<any>
    format?: string
    overlay?: boolean

    /**
      * Defines the position where the calendar will be anchored relative to the input.
    */
    timePickerPosition?: 'left' | 'right'

    /**
      * If `true`, this calendar is part of a globally managed group.
      * When one calendar in this group opens, all others with `autoClosePeersCalendars: true` will close.
    */
    autoClosePeersOverlays?: boolean
  }