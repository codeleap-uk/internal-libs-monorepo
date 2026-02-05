import { Option, TypeGuards } from '@codeleap/types'
import { useCallback, useRef } from 'react'

export function useSelect<T extends string | number>(
  onValueChange: (newValue: any) => void,
  multiple = false,
  limit?: number,
) {
  const selectedValueRef = useRef<any>(multiple ? [] : null)

  const onSingleSelect = useCallback((selectedOption: Option<T>) => {
    const isDeselect = selectedValueRef.current === selectedOption?.value
    const newValue = isDeselect ? null : selectedOption?.value

    selectedValueRef.current = newValue
    onValueChange(newValue)
  }, [onValueChange])

  const onMultiSelect = useCallback((selectedOption: Option<T>) => {
    const currentValue = [...selectedValueRef.current] as T[]
    const selectedValue = selectedOption?.value

    const isDeselect = currentValue.includes(selectedValue)

    if (isDeselect) {
      const newValue = currentValue.filter(v => v !== selectedValue)
      selectedValueRef.current = newValue
      return onValueChange(newValue)
    }

    if (TypeGuards.isNumber(limit) && currentValue.length >= limit) return

    const newValue = [...currentValue, selectedValue]

    selectedValueRef.current = newValue
    onValueChange(newValue)
  }, [onValueChange, limit])

  return {
    onSelect: multiple ? onMultiSelect : onSingleSelect,
  }
}
