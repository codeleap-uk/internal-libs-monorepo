import { TypeGuards } from '@codeleap/types'
import { TextInput } from '../../TextInput'
import { useMemo } from 'react'
import { SelectInputComponentProps } from '../types'

export const SelectInput = <T extends string | number>(props: SelectInputComponentProps<T>) => {
  const {
    options,
    value,
    getLabelFn,
    disabled,
    clearable,
    clearIcon,
    selectIcon,
    onValueChange,
    toggle,
    multiple,
    ...inputProps
  } = props

  const isEmpty = TypeGuards.isArray(value) ? value?.length <= 0 : TypeGuards.isNil(value)
  const canClear = !isEmpty && clearable
  const inputIcon = canClear ? clearIcon : selectIcon

  const onPressInputIcon = () => {
    if (canClear) onValueChange(multiple ? [] as any : null)
    else toggle()
  }

  const text = useMemo(() => {
    if (!value) return ''

    let optionsOrOptions = null

    if (TypeGuards.isArray(value)) {
      optionsOrOptions = options?.filter(op => value?.includes(op?.value))
    } else {
      optionsOrOptions = options?.find(option => option?.value === value)
    }

    return getLabelFn(optionsOrOptions)
  }, [value, getLabelFn])

  return (
    <TextInput
      rightIcon={{
        icon: inputIcon,
        onPress: onPressInputIcon,
      }}
      {...inputProps}
      onPress={disabled ? null : toggle}
      disabled={disabled}
      value={text}
      onValueChange={() => text}
    />
  )
}
