import React, { useState } from 'react'
import { AnyRecord, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import { TimeInputProps } from './types'
import dayjs from 'dayjs'
import Animated, { FadeOut, FadeIn } from 'react-native-reanimated'
import { fields } from '@codeleap/form'
import DatePicker from 'react-native-date-picker'
import { useStylesFor } from '../../hooks'
import { useInputBase } from '../InputBase'
import { View } from '../View'
import { TextInput } from '../TextInput'
import { MobileStyleRegistry } from '../../Registry'
import { useInputOverlay } from '../InputBase/useInputOverlay'

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

  const [inputHeight, setInputHeight] = useState(0)

  const [isOpen, toggle] = useInputOverlay(autoClosePeersOverlays)

  return (
    <View style={[styles.wrapper, { position: 'relative' }]}>
      <TextInput
        placeholder='Select a time'
        disabled={disabled}
        {...textInputProps}
        style={compositionStyles.input}
        leftIcon={!leftIcon ? null : {
          ...leftIcon,
          onPress: toggle,
        }}
        rightIcon={!rightIcon ? null : {
          ...rightIcon,
          onPress: toggle,
        }}
        value={!inputValue ? '' : dayjs(inputValue).format(format)}
        onValueChange={() => inputValue}
        onPress={disabled ? null : toggle}
        innerWrapperProps={{
          rippleDisabled: true,
        }}
        focused={isOpen}
        onLayout={(e) => setInputHeight(e.nativeEvent.layout.height)}
      />

      {!isOpen || disabled ? null : (
        <Animated.View
          exiting={FadeOut.duration(150)}
          entering={FadeIn.duration(150)}
          style={overlay ? {
            position: 'absolute',
            zIndex: 1,
            [timePickerPosition]: 0,
            top: inputHeight + gap,
          } : {
            marginTop: gap,
          }}
        >
          <View style={styles.timePicker}>
            <DatePicker
              mode='time'
              onDateChange={onInputValueChange}
              date={inputValue ?? new Date()}
            />
          </View>
        </Animated.View>
      )}
    </View>
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