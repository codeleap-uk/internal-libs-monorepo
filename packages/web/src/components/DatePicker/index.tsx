import { TypeGuards } from '@codeleap/types'
import { useCallback, useConditionalState } from '@codeleap/hooks'
import { Text, View } from '../components'
import { DatePickerProps, DayComponentProps } from './types'
import ReactDatePicker from 'react-datepicker'
import { Header, OuterInput } from './components'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import dayjs from 'dayjs'

export * from './styles'
export * from './types'
export * from './components'

export function DatePicker(props: DatePickerProps) {
  const {
    hideInput,
    value,
    onValueChange,
    style,
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
    disabled,
    ...otherProps
  } = {
    ...DatePicker.defaultProps,
    ...props,
  }

  const styles = useStylesFor(DatePicker.styleRegistryName, style)

  const [visible, toggle] = useConditionalState(_visible, _toggle, { initialValue: false })
  const [yearShow, setYearShow] = useConditionalState(_yearShow, _setYearShow, { initialValue: false })

  const DayContentComponent = useCallback((_param: DayComponentProps) => {
    const param = {
      ..._param,
      ...dayProps,
    }

    const date = dayjs(param?.date).format('DD MMM YYYY');
    const dateValue = value ? dayjs(value).format('DD MMM YYYY') : ''

    const isSelected = date === dateValue

    const isDisabled = [
      dayjs(param?.date).isBefore(dayjs(minDate)),
      dayjs(param?.date).isAfter(dayjs(maxDate))
    ].some(Boolean)

    const getStyles = (key) => {
      return {
        ...styles[key],
        ...(isSelected && styles[`${key}:selected`]),
        ...(!isSelected && isDisabled && styles[`${key}:disabled`]),
      }
    }

    if (TypeGuards.isFunction(DayComponent)) {
      return (
        <DayComponent
          {...param}
          value={value}
          disabled={isDisabled}
          selected={isSelected}
          styles={styles}
        />
      )
    }

    return (
      <View style={getStyles('dayWrapper')}>
        <Text style={getStyles('day')} text={String(param?.day)} />
      </View>
    )
  }, [value])

  const YearContentComponent = useCallback((_param) => {
    const param = {
      ..._param,
      ...yearProps,
    }

    const isSelected = String(value)?.includes(param?.year)

    const getStyles = (key) => {
      return {
        ...styles[key],
        ...(isSelected && styles[`${key}:selected`]),
      }
    }

    if (TypeGuards.isFunction(YearComponent)) {
      return (
        <YearComponent
          {...param}
          value={value}
          selected={isSelected}
          styles={styles}
        />
      )
    }

    return (
      <View style={getStyles('yearWrapper')}>
        <Text style={getStyles('year')} text={param?.year} />
      </View>
    )
  }, [value])

  const compositionStyles = useCompositionStyles(['outerInput', 'header'], styles)

  return (
    <View style={styles.wrapper}>
      <ReactDatePicker
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
            style={compositionStyles.outerInput}
            focused={visible}
            hideInput={hideInput}
            {...otherProps}
          />
        }
        renderCustomHeader={(headerProps) => (
          <HeaderComponent
            styles={compositionStyles.header}
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

DatePicker.styleRegistryName = 'DatePicker'

DatePicker.elements = [
  'wrapper',
  'day',
  'year',
  'outerInput',
  'header',
]

DatePicker.rootElement = 'wrapper'

DatePicker.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return DatePicker as (props: StyledComponentProps<DatePickerProps, typeof styles>) => IJSX
}

DatePicker.defaultProps = {
  minDate: new Date(1910, 0, 1),
  maxDate: new Date(),
  startDate: new Date(1923, 0, 1),
  outerInputComponent: OuterInput,
  headerComponent: Header,
  disabled: false,
} as Partial<DatePickerProps>

WebStyleRegistry.registerComponent(DatePicker)
