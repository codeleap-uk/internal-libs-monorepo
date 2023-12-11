import {
  TypeGuards,
  getNestedStylesByKey,
  useCallback,
  useDefaultComponentStyle,
  useState,
} from '@codeleap/common'
import { Text, View } from '../components'
import { DatePickerPresets } from './styles'
import { DatePickerProps, DayComponentProps } from './types'
import _DatePicker from 'react-datepicker'
import { Header, OuterInput } from './defaultComponents'
import { format, isBefore, isAfter } from 'date-fns'

export * from './styles'
export * from './types'
export * from './defaultComponents'

const defaultProps = {
  variants: [],
  styles: {},
  minDate: new Date(1910, 0, 1),
  maxDate: new Date(),
  startDate: new Date(1923, 0, 1),
  outerInputComponent: OuterInput,
  headerComponent: Header,
}

export function DatePicker(props: DatePickerProps) {
  const allProps = {
    ...DatePicker.defaultProps,
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
    outerInputComponent: OuterInputComponent,
    headerComponent: HeaderComponent,
    headerProps: _headerProps,
    dayComponent: DayComponent,
    dayProps,
    yearComponent: YearComponent,
    yearProps,
    datePickerProps,
    minDate,
    maxDate,
    startDate,
    visible: _visible,
    toggle: _toggle,
    yearShow: _yearShow,
    setYearShow: _setYearShow,
    disabled = false,
    ...otherProps
  } = allProps

  const [visible, toggle] =
    TypeGuards.isBoolean(_visible) && TypeGuards.isFunction(_toggle)
      ? [_visible, _toggle]
      : useState(false)
  const [yearShow, setYearShow] =
    TypeGuards.isBoolean(_yearShow) && TypeGuards.isFunction(_setYearShow)
      ? [_yearShow, _setYearShow]
      : useState(false)

  const variantStyles = useDefaultComponentStyle<
    'u:DatePicker',
    typeof DatePickerPresets
  >('u:DatePicker', {
    variants,
    responsiveVariants,
    styles,
  })

  const DayContentComponent = useCallback(
    (_param: DayComponentProps) => {
      const param = {
        ..._param,
        ...dayProps,
      }

      const { day, date: _date } = param

      const date = format(new Date(_date), 'dd MMM yyyy')
      const dateValue = value ? format(new Date(value), 'dd MMM yyyy') : ''

      const isSelected = date === dateValue

      const isDisabled = [
        isBefore(_date, minDate),
        isAfter(_date, maxDate),
      ].some(Boolean)

      const getStyles = (key) => {
        return {
          ...variantStyles[key],
          ...(isSelected && variantStyles[`${key}:selected`]),
          ...(!isSelected && isDisabled && variantStyles[`${key}:disabled`]),
        }
      }

      if (TypeGuards.isFunction(DayComponent)) {
        return (
          <DayComponent
            {...param}
            value={value}
            disabled={isDisabled}
            selected={isSelected}
            variantStyles={variantStyles}
          />
        )
      }

      return (
        <View css={getStyles('dayWrapper')}>
          <Text style={getStyles('day')} disabled={isDisabled} text={day} />
        </View>
      )
    },
    [value],
  )

  const YearContentComponent = useCallback(
    (_param) => {
      const param = {
        ..._param,
        ...yearProps,
      }

      const { year } = param

      const isSelected = String(value)?.includes(year)

      const getStyles = (key) => {
        return {
          ...variantStyles[key],
          ...(isSelected && variantStyles[`${key}:selected`]),
        }
      }

      if (TypeGuards.isFunction(YearComponent)) {
        return (
          <YearComponent
            {...param}
            value={value}
            selected={isSelected}
            variantStyles={variantStyles}
          />
        )
      }

      return (
        <View css={getStyles('yearWrapper')}>
          <Text style={getStyles('year')} text={year} />
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
        todayButton={null}
        shouldCloseOnSelect={false}
        openToDate={defaultValue ?? value}
        dateFormat='dd/MM/yyyy'
        formatWeekDay={(t) => t[0]}
        calendarStartDay={1}
        placeholderText={otherProps?.placeholder}
        disabled={disabled}
        renderDayContents={(day, date) => (
          <DayContentComponent day={day} date={date} />
        )}
        customInput={
          <OuterInputComponent
            styles={inputStyles}
            focused={visible}
            hideInput={hideInput}
            {...otherProps}
          />
        }
        renderCustomHeader={(headerProps) => (
          <HeaderComponent
            styles={headerStyles}
            setYearShow={setYearShow}
            prevYearButtonDisabled={yearShow}
            nextYearButtonDisabled={yearShow}
            {...headerProps}
            {..._headerProps}
          />
        )}
        onFocus={() => toggle(true)}
        onSelect={() => (yearShow ? setYearShow(false) : toggle(false))}
        onClickOutside={() => {
          toggle(false)
          setYearShow(false)
        }}
        minDate={minDate}
        maxDate={maxDate}
        endDate={maxDate}
        startDate={startDate}
        onYearChange={() => setYearShow(false)}
        yearItemNumber={maxDate.getFullYear() - minDate.getFullYear()}
        showYearPicker={yearShow}
        renderYearContent={(year) => {
          if (year < startDate.getFullYear() || year > maxDate.getFullYear()) return null
          return <YearContentComponent year={year} />
        }}
        filterDate={(date) => {
          if (date.getFullYear() < startDate.getFullYear() || date.getFullYear() > maxDate.getFullYear()) return false
          return true
        }}
        {...datePickerProps}
      />
    </View>
  )
}

DatePicker.defaultProps = defaultProps
