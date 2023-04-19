/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  ComponentVariants,
  StylesOf,
  useDefaultComponentStyle,
  useCodeleapContext,
  TypeGuards,
} from '@codeleap/common'
import { ComponentPropsWithRef } from 'react'
import { View } from '../View'
import { Text } from '../Text'
import {
  CheckboxComposition,
  CheckboxPresets
} from './styles'
type NativeCheckboxProps = ComponentPropsWithRef<'input'>
export * from './styles'
export type CheckboxProps = NativeCheckboxProps & {
  checked?: boolean
  onValueChange?: (checked: boolean) => any
  label?: React.ReactNode
  styles?: StylesOf<CheckboxComposition>
} & ComponentVariants<typeof CheckboxPresets>

export const Checkbox = (checkboxProps: CheckboxProps) => {
  const {
    checked,
    onValueChange,
    variants = [],
    responsiveVariants = {},
    label,
    onChange,
    styles,
    ...props
  } = checkboxProps

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, value?: boolean) {
    const isChecked = TypeGuards.isBoolean(value) ? value : e.target.checked
    if (e) {
      onChange && onChange(e)
    }
    onValueChange && onValueChange(isChecked)
  }

  const variantStyles = useDefaultComponentStyle('Checkbox', {
    responsiveVariants,
    variants,
    styles,
  } as any) as StylesOf<CheckboxComposition>

  return (
    <View component='label' css={{ ...variantStyles.wrapper }}>
      <input
        {...props}
        css={variantStyles.input}
        onChange={handleChange}
        type='checkbox'
        checked={checked}
      />
      <span
        className='checkbox-label'
        onClick={() => handleChange(null, !checked)}
        css={{
          ...variantStyles.checkmarkWrapper,
          '&:after': {
            ...variantStyles.checkmark,
          },
        }}
      />
      {typeof label === 'string' ? (
        <Text text={label} styles={{ text: variantStyles.label }} />
      ) : (
        label
      )}
    </View>
  )
}
