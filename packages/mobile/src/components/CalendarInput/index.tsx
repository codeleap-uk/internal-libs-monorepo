import React, { useCallback, useState } from 'react'
import { AnyRecord, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { CalendarInputProps } from './types'
import { View } from '../View'
import { Calendar } from '../Calendar'
import { TextInput } from '../TextInput'
import dayjs from 'dayjs'
import Animated, { FadeOut, FadeIn } from 'react-native-reanimated'
import { globalState } from '@codeleap/store'
import { useBooleanToggle, useId } from '@codeleap/hooks'
import { useInputBase } from '../InputBase'
import { fields } from '@codeleap/form'

export * from './styles'
export * from './types'

const calendarStore = globalState({})

const useCalendar = (id: string, autoClosePeersCalendars: boolean) => {
  if (!autoClosePeersCalendars) return useBooleanToggle(false)

  const isOpen = calendarStore.use(state => state[id])

  const toggle = useCallback(() => {
    const isCurrentlyOpen = calendarStore.value[id]
    const isAnyOtherOpen = Object.entries(calendarStore.value).some(
      ([key, isOpen]) => key !== id && isOpen
    )

    const newValues = Object.keys(calendarStore.value).reduce((acc, key) => {
      acc[key] = false
      return acc
    }, {} as Record<string, boolean>)

    if (isAnyOtherOpen && !isCurrentlyOpen) {
      calendarStore.set(newValues)

      setTimeout(() => {
        calendarStore.set({ [id]: true })
      }, 100)
    } else {
      calendarStore.set({ ...newValues, [id]: !isCurrentlyOpen })
    }
  }, [])

  return [isOpen, toggle]
}

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
    ...textInputProps
  } = {
    ...CalendarInput.defaultProps,
    ...props
  }

  const id = useId()

  const styles = useStylesFor(CalendarInput.styleRegistryName, style)

  const compositionStyles = useCompositionStyles(['calendar', 'input'], styles)

  const {
    inputValue,
    onInputValueChange,
  } = useInputBase<Date | string>(field, fields.date as any, { value, onValueChange })

  const [inputHeight, setInputHeight] = useState(0)

  const [isOpen, toggle] = useCalendar(id, autoClosePeersCalendars)

  return (
    <View style={[styles.wrapper, { position: 'relative' }]}>
      <TextInput
        placeholder='Select Date'
        disabled={disabled}
        {...textInputProps}
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
            [calendarPosition]: 0,
            top: inputHeight + gap,
          } : {
            marginTop: gap,
          }}
        >
          <Calendar
            style={compositionStyles.calendar}
            value={inputValue}
            onValueChange={onInputValueChange}
          />
        </Animated.View>
      )}
    </View>
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