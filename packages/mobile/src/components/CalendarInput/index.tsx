import React, { useMemo } from 'react'
import { AnyRecord, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { CalendarInputProps } from './types'
import { Calendar } from '../Calendar'
import { TextInput } from '../TextInput'
import { useInputBase } from '../InputBase'
import { fields } from '@codeleap/form'
import { dateUtils } from '@codeleap/utils'
import { InputOverlay, inputOverlayManager } from '../InputOverlay'

export * from './styles'
export * from './types'

export const CalendarInput = (props: CalendarInputProps) => {
  const {
    style,
    value,
    onValueChange,
    disabled,
    gap,
    calendarPosition,
    rightIcon,
    leftIcon,
    autoClosePeersCalendars,
    field,
    format,
    overlay,
    calendarProps,
    ...textInputProps
  } = {
    ...CalendarInput.defaultProps,
    ...props
  }

  const styles = useStylesFor(CalendarInput.styleRegistryName, style)

  const compositionStyles = useCompositionStyles(['calendar', 'input'], styles)

  const {
    inputValue,
    onInputValueChange,
  } = useInputBase<any>(field, fields.date as any, { value, onValueChange })

  const { isOpen, toggle, id } = inputOverlayManager.use()

  const formattedValue = useMemo(() => {
    if (!inputValue) return ''

    if (Array.isArray(inputValue)) {
      const filled = inputValue.filter(Boolean)
      if (filled.length < inputValue.length) return ''
      return filled.map((v) => dateUtils.removeTimezoneAndFormat(v, format)).join(' - ')
    }

    return dateUtils.removeTimezoneAndFormat(inputValue, format)
  }, [inputValue, format])

  return (
    <InputOverlay.Layout
      style={styles.wrapper}
      position={calendarPosition}
      gap={gap}
      isOpen={isOpen}
      mode={overlay ? 'overlay' : 'content'}
      hideOverlay={disabled}
      id={id}
      content={
        <Calendar
          style={compositionStyles.calendar}
          value={inputValue}
          onValueChange={onInputValueChange}
          {...calendarProps}
        />
      }
    >
      <TextInput
        placeholder='Select Date'
        disabled={disabled}
        {...textInputProps}
        style={compositionStyles.input}
        value={formattedValue}
        onValueChange={() => inputValue}
        onPress={disabled ? undefined : toggle}
        innerWrapperProps={{
          rippleDisabled: true,
        }}
        focused={isOpen}
        leftIcon={!leftIcon ? null : {
          ...leftIcon,
          onPress: toggle,
        }}
        rightIcon={!rightIcon ? null : {
          ...rightIcon,
          onPress: toggle,
        }}
      />
    </InputOverlay.Layout>
  )
}

CalendarInput.styleRegistryName = 'CalendarInput'
CalendarInput.elements = ['wrapper', 'calendar', 'input']
CalendarInput.rootElement = 'wrapper'

CalendarInput.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return CalendarInput as (props: StyledComponentProps<CalendarInputProps, typeof styles>) => IJSX
}

CalendarInput.defaultProps = {
  gap: 8,
  calendarPosition: 'left',
  autoClosePeersCalendars: false,
  format: 'DD/MM/YYYY',
  overlay: true,
} as Partial<CalendarInputProps>

MobileStyleRegistry.registerComponent(CalendarInput)