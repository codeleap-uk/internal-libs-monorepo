import { Option, Options, TypeGuards } from '@codeleap/types'
import { TextInput, TextInputProps } from '../../TextInput'
import { useMemo } from 'react'

type SelectInputProps<T> = Omit<TextInputProps, 'value'> & {
  options: Option<T>[]
  value: T | T[]
  getLabelFn?: (optionsOrOptions: Option<T> | Options<T>) => string
}

export const SelectInput = <T extends string | number | any>(props: SelectInputProps<T>) => {
  const {
    options,
    value,
    getLabelFn,
    disabled,
    onPress,
    ...inputProps
  } = props

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
      {...inputProps}
      onPress={disabled ? null : onPress}
      disabled={disabled}
      value={label}
      onValueChange={() => label}
    />
  )
}
