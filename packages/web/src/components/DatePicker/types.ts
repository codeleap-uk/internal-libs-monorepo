import { ComponentVariants, StylesOf } from '@codeleap/common'
import { DatePickerComposition, DatePickerPresets } from './styles'
import DatePicker from 'react-datepicker'

console.log(DatePicker.defaultProps)

export type DatePickerProps = ComponentVariants<typeof DatePickerPresets> & {
  date: Date
  onDateChange: (date: Date) => void
  styles?: StylesOf<DatePickerComposition>
  style?: React.CSSProperties
}
