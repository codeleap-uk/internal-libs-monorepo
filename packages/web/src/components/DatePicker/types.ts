import { FormTypes } from '@codeleap/common'
import {
  ReactDatePickerCustomHeaderProps,
  ReactDatePickerProps,
} from 'react-datepicker'
import { ActionIconProps, TextInputProps } from '../components'
import { DatePickerComposition, DatePickerHeaderComposition } from './styles'

export type DatePickerOuterInputProps = TextInputProps & {
  valueLabel: FormTypes.Label
  hideInput?: boolean
}

export type DatePickerHeaderComponent = ReactDatePickerCustomHeaderProps & {
  styles?: DatePickerHeaderComposition
}

export type DatePickerArrowProps = Partial<ActionIconProps> & {
  direction: 'left' | 'right'
}

type RootDatePickerProps = 'startDate' | 'minDate' | 'maxDate'

export type DatePickerProps = Partial<
  Pick<Partial<ReactDatePickerProps>, RootDatePickerProps>
> & {
  styles?: DatePickerComposition
  style?: any
  hideInput?: boolean
  value: Date
  outerInputComponent?: React.ComponentType<Partial<DatePickerOuterInputProps>>
  headerComponent?: React.ComponentType<DatePickerHeaderComponent>
  formatDate?: (date: Date | string) => FormTypes.Label
  datePickerProps?: Omit<
    Partial<ReactDatePickerProps>,
    'customInput' | 'renderCustomHeader' | RootDatePickerProps
  >
  onValueChange: (date: Date) => void
  defaultValue?: Date
} & Omit<TextInputProps, 'defaultValue'>
