/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  SelectStyles,
  ComponentVariants,
  useDefaultComponentStyle,
  StylesOf,
} from '@codeleap/common'
import { ComponentPropsWithRef, ReactNode } from 'react'
import { View, ViewProps } from '../View'
import { Text } from '../Text'
import { SelectComposition } from './styles'

type HTMLSelectProps = ComponentPropsWithRef<'select'>
type Option = {
  label: string
  value: string | number
}

export type NativeSelectProps = HTMLSelectProps & {
  options: Array<Option>
  styles?: StylesOf<SelectComposition>
  label?: string | ReactNode
  wrapperProps?: ViewProps<'div'>
  onValueChange?: (value: string | number) => void
} & ComponentVariants<typeof SelectStyles>

export const NativeSelect = (selectProps: NativeSelectProps) => {
  const {
    variants = [],
    responsiveVariants = {},
    options,
    styles,
    label,
    onValueChange,
    wrapperProps,
    value,
    is,
    ...props
  } = selectProps

  const variantStyles = useDefaultComponentStyle('Select', {
    responsiveVariants,
    variants,
    styles,
  })
  function handleChange(e) {
    props.onChange && props.onChange(e)
    onValueChange && onValueChange(e.target.value)
  }
  return (
    <View css={variantStyles.wrapper} {...wrapperProps}>
      {label ? (
        typeof label === 'string' ? (
          <Text css={variantStyles.label} text={label} />
        ) : (
          label
        )
      ) : null}
      <View
        component='select'
        css={variantStyles.select}
        {...props}
        onChange={handleChange}
      >
        {options.map((option, index) => (
          <option
            value={option.value}
            key={index}
            selected={value == option.value}
          >
            {option.label}
          </option>
        ))}
      </View>
    </View>
  )
}
