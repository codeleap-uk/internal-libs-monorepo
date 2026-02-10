import { Option, TypeGuards } from '@codeleap/types'
import { deepEqual } from '@codeleap/utils'
import { useCallback, useEffect, useRef } from 'react'

export function useSelect<T extends string | number>(
  value: any,
  onValueChange: (newValue: any) => void,
  multiple = false,
  limit?: number,
  onSelect?: (option: Option<T>) => void,
) {
  const selectedValueRef = useRef<any>(multiple ? [] : null)

  useEffect(() => {
    if (!deepEqual(value, selectedValueRef.current)) {
      selectedValueRef.current = value
    }
  }, [value])

  const onSingleSelect = useCallback((selectedOption: Option<T>) => {
    const isDeselect = selectedValueRef.current === selectedOption?.value
    const newValue = isDeselect ? null : selectedOption?.value

    selectedValueRef.current = newValue
    onValueChange(newValue)
    onSelect?.(selectedOption)
  }, [onValueChange, onSelect])

  const onMultiSelect = useCallback((selectedOption: Option<T>) => {
    const currentValue = [...(selectedValueRef.current ?? [])] as T[]
    const selectedValue = selectedOption?.value

    const isDeselect = currentValue.includes(selectedValue)

    if (isDeselect) {
      const newValue = currentValue.filter(v => v !== selectedValue)
      selectedValueRef.current = newValue
      onValueChange(newValue)
      return onSelect?.(selectedOption)
    }

    if (TypeGuards.isNumber(limit) && currentValue.length >= limit) return

    const newValue = [...currentValue, selectedValue]

    selectedValueRef.current = newValue
    onValueChange(newValue)
    onSelect?.(selectedOption)
  }, [onValueChange, limit, onSelect])

  return {
    onSelect: multiple ? onMultiSelect : onSingleSelect,
  }
}
