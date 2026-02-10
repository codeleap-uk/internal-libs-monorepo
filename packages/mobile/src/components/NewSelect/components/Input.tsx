import { TypeGuards } from '@codeleap/types'
import { TextInput, TextInputProps } from '../../TextInput'
import { useMemo } from 'react'
import { SelectProps } from '../types'

type SelectInputProps<T extends string | number> =
  Omit<TextInputProps, 'value' | 'onValueChange'> &
  Pick<
    SelectProps<T>,
    'value' | 'onValueChange' | 'getLabelFn' | 'options' | 'clearIcon' | 'selectIcon' | 'toggle' | 'clearable' | 'multiple'
  >

export const SelectInput = <T extends string | number>(props: SelectInputProps<T>) => {
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

  const canClear = !TypeGuards.isNil(value) && clearable
  const inputIcon = canClear ? clearIcon : selectIcon

  const onPressInputIcon = () => {
    if (canClear) onValueChange(multiple ? [] as any : null)
    else toggle()
  }

  const label = useMemo(() => {
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
      value={label}
      onValueChange={() => label}
    />
  )
}
