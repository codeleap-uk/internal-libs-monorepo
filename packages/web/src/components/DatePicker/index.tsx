import {
  getNestedStylesByKey,
  useCallback,
  useDefaultComponentStyle,
  useState,
} from '@codeleap/common'
import { Text, View } from '../components'
import { DatePickerPresets } from './styles'
import { DatePickerProps } from './types'
import _DatePicker from 'react-datepicker'
import { Header, OuterInput } from './defaultComponents'
import { format, isBefore, isAfter } from 'date-fns'

export * from './styles'
export * from './types'
export * from './defaultComponents'

const defaultProps = {
  variants: [],
  styles: {},
  minDate: new Date(1950, 0, 1),
  outerInputComponent: OuterInput,
  headerComponent: Header,
}

export function DatePicker(props: DatePickerProps) {
  const allProps = {
    ...defaultProps,
    ...props,
  }

  const {
    hideInput,
    value,
    onValueChange,
    variants,
    styles,
    style,
    responsiveVariants,
    defaultValue,
    outerInputComponent,
    headerComponent,
    datePickerProps,
    minDate,
    maxDate,
    startDate,
    ...otherProps
  } = allProps

  const [visible, setVisible] = useState(false)
  const [yearShow, setYearShow] = useState(false)

  const variantStyles = useDefaultComponentStyle<
    'u:DatePicker',
    typeof DatePickerPresets
  >('u:DatePicker', {
    variants,
    responsiveVariants,
    styles,
  })

  const DayContentComponent = useCallback(
    (param) => {
      const { day, date: _date } = param

      const date = format(new Date(_date), 'dd MMM yyyy')
      const dateValue = value ? format(new Date(value), 'dd MMM yyyy') : ''

      const isSelected = date === dateValue

      const isDisabled = [
        isBefore(_date, minDate),
        isAfter(_date, maxDate),
      ].some(Boolean)

      return (
        <View
          css={[
            variantStyles.dayWrapper,
            isSelected && variantStyles['dayWrapper:selected'],
          ]}
        >
          <Text
            style={[
              variantStyles.day,
              isSelected && variantStyles['day:selected'],
              !isSelected && isDisabled && variantStyles['day:disabled'],
            ]}
            disabled={isDisabled}
            text={day}
          />
        </View>
      )
    },
    [value],
  )

  const YearContentComponent = useCallback(
    (param) => {
      const { year } = param

      const selected = String(value)?.includes(year)

      return (
        <View
          css={[
            variantStyles.yearWrapper,
            selected && variantStyles['yearWrapper:selected'],
          ]}
        >
          <Text
            style={[
              variantStyles.year,
              selected && variantStyles['year:selected'],
            ]}
            text={year}
          />
        </View>
      )
    },
    [value],
  )

  const inputStyles = getNestedStylesByKey('outerInput', variantStyles)
  const headerStyles = getNestedStylesByKey('header', variantStyles)

  return (
    <View css={variantStyles.wrapper}>
      <_DatePicker
        onChange={onValueChange}
        open={visible}
        selected={value}
        shouldCloseOnSelect={false}
        openToDate={defaultValue ?? value}
        dateFormat='dd/MM/yyyy'
        formatWeekDay={(t) => t[0]}
        calendarStartDay={1}
        placeholderText={otherProps?.placeholder}
        renderDayContents={(day, date) => (
          <DayContentComponent day={day} date={date} />
        )}
        customInput={
          <OuterInput
            styles={inputStyles}
            focused={visible}
            hideInput={hideInput}
            {...otherProps}
          />
        }
        renderCustomHeader={(headerProps) => (
          <Header
            styles={headerStyles}
            setYearShow={setYearShow}
            prevYearButtonDisabled={yearShow}
            nextYearButtonDisabled={yearShow}
            {...headerProps}
          />
        )}
        onFocus={() => setVisible(true)}
        onSelect={() => (yearShow ? setYearShow(false) : setVisible(false))}
        onClickOutside={() => {
          setVisible(false)
          setYearShow(false)
        }}
        minDate={minDate}
        maxDate={maxDate}
        startDate={startDate}
        onYearChange={() => setYearShow(false)}
        showYearPicker={yearShow}
        renderYearContent={(year) => <YearContentComponent year={year} />}
        {...datePickerProps}
      />
    </View>
  )
}

DatePicker.defaultProps = defaultProps
