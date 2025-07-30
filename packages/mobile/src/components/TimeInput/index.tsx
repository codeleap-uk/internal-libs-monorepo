import React from 'react'
import { AnyRecord, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import { TimeInputProps } from './types'
import dayjs from 'dayjs'
import { fields } from '@codeleap/form'
import DatePicker from 'react-native-date-picker'
import { useStylesFor } from '../../hooks'
import { useInputBase } from '../InputBase'
import { View } from '../View'
import { TextInput } from '../TextInput'
import { MobileStyleRegistry } from '../../Registry'
import { InputOverlay, inputOverlayManager } from '../InputOverlay'

export * from './styles'
export * from './types'

export const TimeInput = (props: TimeInputProps) => {
  const {
    style,
    value,
    onValueChange,
    disabled,
    gap,
    timePickerPosition,
    rightIcon,
    leftIcon,
    autoClosePeersOverlays,
    field,
    format,
    overlay,
    timePickerProps,
    ...textInputProps
  } = {
    ...TimeInput.defaultProps,
    ...props
  }

  const styles = useStylesFor(TimeInput.styleRegistryName, style)

  const compositionStyles = useCompositionStyles(['input'], styles)

  const {
    inputValue,
    onInputValueChange,
  } = useInputBase<Date>(field, fields.date as any, { value, onValueChange })

  const { isOpen, toggle, id } = inputOverlayManager.use()

  return (
    <InputOverlay.Layout
      style={styles.wrapper}
      position={timePickerPosition}
      gap={gap}
      isOpen={isOpen}
      mode={overlay ? 'overlay' : 'content'}
      hideOverlay={disabled}
      id={id}
      content={
        <View style={styles.timePicker}>
          <DatePicker
            mode='time'
            theme='light'
            {...timePickerProps}
            onDateChange={onInputValueChange}
            date={inputValue ?? new Date()}
          />
        </View>
      }
    >
      <TextInput
        placeholder='Select a time'
        disabled={disabled}
        {...textInputProps}
        style={compositionStyles.input}
        value={!inputValue ? '' : dayjs(inputValue).format(format)}
        onValueChange={() => inputValue}
        onPress={disabled ? undefined : toggle}
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

TimeInput.styleRegistryName = 'TimeInput'
TimeInput.elements = ['wrapper', 'timePicker', 'input']
TimeInput.rootElement = 'wrapper'

TimeInput.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return TimeInput as (props: StyledComponentProps<TimeInputProps, typeof styles>) => IJSX
}

TimeInput.defaultProps = {
  gap: 8,
  timerPickerPosition: 'left',
  autoClosePeersCalendars: false,
  format: 'hh:mm A',
  overlay: true,
} as Partial<TimeInputProps>

MobileStyleRegistry.registerComponent(TimeInput)