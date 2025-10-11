import { useCallback, useConditionalState } from '@codeleap/hooks'
import { View } from '../components'
import { DatePickerProps } from './types'
import { DatePicker as ReactDatePicker } from 'react-datepicker'
import { DayContent, Header, OuterInput, YearContent } from './components'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'

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
    dayComponent,
    dayProps: providedDayProps,
    yearComponent,
    yearProps: providedYearProps,
    datePickerProps,
    minDate,
    maxDate,
    startDate,
    disabled,
    visible: providedVisible,
    toggle: providedToggle,
    yearShow: providedYearShow,
    setYearShow: providedSetYearShow,
    ...otherProps
  } = {
    ...DatePicker.defaultProps,
    ...props,
  }

  const styles = useStylesFor(DatePicker.styleRegistryName, style)

  const compositionStyles = useCompositionStyles(['outerInput', 'header'], styles)

  const [visible, toggle] = useConditionalState(providedVisible, providedToggle, { initialValue: false })
  const [yearShow, setYearShow] = useConditionalState(providedYearShow, providedSetYearShow, { initialValue: false })

  const DayContentComponent = useCallback(({ day, date }) => {
    return (
      <DayContent
        day={day}
        date={date}
        {...providedDayProps}
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        component={dayComponent}
        styles={styles}
      />
    )
  }, [value])

  const YearContentComponent = useCallback(({ year }) => {
    return (
      <YearContent
        year={year}
        {...providedYearProps}
        value={value}
        component={yearComponent}
        styles={styles}
      />
    )
  }, [value])

  return (
    <View style={styles.wrapper}>
      <ReactDatePicker
        onChange={onValueChange as any}
        selected={value as any}
        selectsMultiple
        open={visible}
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
        {...datePickerProps as any}
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
