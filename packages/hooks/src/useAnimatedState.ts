import { useState, useCallback } from 'react'
import { SharedValue, useSharedValue, useDerivedValue, runOnJS, isSharedValue } from 'react-native-reanimated'

/**
 * Hook that synchronizes a React state with a Reanimated SharedValue.
 *
 * @example
 * const [value, setValue, sharedValue] = useAnimatedState(0)
 * setValue(10) // Updates both React state and SharedValue
 */
export function useAnimatedState<T>(initialValue: SharedValue<T> | T) {
  const sharedValue = isSharedValue(initialValue)
    ? initialValue
    : useSharedValue<T>(initialValue)

  const [value, _setValue] = useState<T>(
    isSharedValue(initialValue) ? initialValue.value : initialValue,
  )

  useDerivedValue(() => {
    runOnJS(_setValue)(sharedValue.value)
  })

  const setValue = useCallback((newValue: T) => {
    sharedValue.value = newValue
    if (isSharedValue(initialValue)) initialValue.value = newValue
    _setValue(newValue)
  }, [])

  return [value, setValue, sharedValue] as const
}

/**
 * Hook that extracts and synchronizes the value from a SharedValue.
 *
 * @example
 * const value = useAnimatedValue(sharedValue)
 */
export function useAnimatedValue<T>(initialValue: SharedValue<T> | T): T {
  const [value] = useAnimatedState(initialValue)
  return value
}
