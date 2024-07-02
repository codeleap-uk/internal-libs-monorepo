import { FormTypes, StylesOf } from '@codeleap/common'
import { ReactDatePickerCustomHeaderProps, ReactDatePickerProps } from 'react-datepicker'
import { ActionIconProps, TextInputProps } from '../components'
import { DatePickerComposition, DatePickerHeaderComposition } from './styles'
import { StyledProp } from '@codeleap/styles'

export type DatePickerOuterInputProps = TextInputProps & {
  valueLabel: FormTypes.Label
  hideInput?: boolean
}

export type DatePickerHeaderComponent = Omit<ReactDatePickerCustomHeaderProps, 'styles'> & {
  styles?: StylesOf<DatePickerHeaderComposition>
  formatHeaderTitle?: (date: Date) => string
}

export type DatePickerArrowProps = Partial<ActionIconProps> & {
  direction: 'left' | 'right'
}

export type DayComponentProps = {
  day: string | number
  value?: Date
  date: Date
  disabled?: boolean
  selected?: boolean
  styles?: DatePickerProps['style']
}

export type YearComponentProps = {
  year: string | number
  value: Date
  selected: boolean
  styles: DatePickerProps['style']
}

type RootDatePickerProps = 'startDate' | 'minDate' | 'maxDate'

export type DatePickerProps =
  Omit<Partial<Pick<Partial<ReactDatePickerProps>, RootDatePickerProps>>, 'style'> &
  Omit<TextInputProps, 'defaultValue' | 'style'> &
  {
    style?: StyledProp<DatePickerComposition>
    hideInput?: boolean
    value: Date
    outerInputComponent?: React.ComponentType<Partial<DatePickerOuterInputProps>>
    headerComponent?: React.ComponentType<Partial<DatePickerHeaderComponent>>
    headerProps?: Partial<DatePickerHeaderComponent>
    dayComponent?: React.ComponentType<Partial<DayComponentProps>>
    dayProps?: Partial<DayComponentProps>
    yearComponent?: React.ComponentType<Partial<YearComponentProps>>
    yearProps?: Partial<YearComponentProps>
    formatDate?: (date: Date | string) => FormTypes.Label
    datePickerProps?: Omit<Partial<ReactDatePickerProps>, 'customInput' | 'renderCustomHeader' | RootDatePickerProps>
    onValueChange: (date: Date) => void
    defaultValue?: Date
    visible?: boolean
    toggle?: () => void
    yearShow?: boolean
    setYearShow?: () => void
  }
