import { ComponentVariants, FormTypes, StylesOf } from '@codeleap/common'
import {
  ReactDatePickerCustomHeaderProps,
  ReactDatePickerProps,
} from 'react-datepicker'
import { ActionIconProps, TextInputProps } from '../components'
import {
  DatePickerComposition,
  DatePickerHeaderComposition,
  DatePickerPresets,
} from './styles'

export type DatePickerOuterInputProps = TextInputProps & {
  valueLabel: FormTypes.Label
  hideInput?: boolean
}

export type DatePickerHeaderComponent = ReactDatePickerCustomHeaderProps & {
  styles?: DatePickerHeaderComposition
  formatHeaderTitle?: (date: Date) => string
}

export type DatePickerArrowProps = Partial<ActionIconProps> & {
  direction: 'left' | 'right'
}

type RootStyles = ComponentVariants<typeof DatePickerPresets>

export type DayComponentProps = {
  day: string | number
  value: Date
  date: Date
  disabled: boolean
  selected: boolean
  variantStyles: any
}

export type YearComponentProps = {
  year: string | number
  value: Date
  selected: boolean
  variantStyles: any
}

type RootDatePickerProps = 'startDate' | 'minDate' | 'maxDate'

export type DatePickerProps = Partial<
  Pick<Partial<ReactDatePickerProps>, RootDatePickerProps>
> &
  RootStyles & {
    styles?: StylesOf<DatePickerComposition>
    style?: React.CSSProperties
    hideInput?: boolean
    value: Date
    outerInputComponent?: React.ComponentType<
      Partial<DatePickerOuterInputProps>
    >
    headerComponent?: React.ComponentType<Partial<DatePickerHeaderComponent>>
    headerProps?: Partial<DatePickerHeaderComponent>
    dayComponent?: React.ComponentType<Partial<DayComponentProps>>
    dayProps?: Partial<DayComponentProps>
    yearComponent?: React.ComponentType<Partial<YearComponentProps>>
    yearProps?: Partial<YearComponentProps>
    formatDate?: (date: Date | string) => FormTypes.Label
    datePickerProps?: Omit<
      Partial<ReactDatePickerProps>,
      'customInput' | 'renderCustomHeader' | RootDatePickerProps
    >
    onValueChange: (date: Date) => void
    defaultValue?: Date
    visible?: boolean
    toggle?: () => void
    yearShow?: boolean
    setYearShow?: () => void
  } & Omit<
    TextInputProps,
    'defaultValue' | 'styles' | 'variants' | 'responsiveVariants'
  >
