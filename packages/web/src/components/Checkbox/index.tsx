/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  ComponentVariants,
  StylesOf,
  useDefaultComponentStyle,
  useCodeleapContext,
} from '@codeleap/common'
import { ComponentPropsWithRef } from 'react'
import { View } from '../View'
import { Text } from '../Text'
import {
  WebCheckboxComposition,
  WebCheckboxStyles as CheckboxStyles,
} from './styles'
type NativeCheckboxProps = ComponentPropsWithRef<'input'>;
export * from './styles'
export type CheckboxProps = NativeCheckboxProps & {
  checked?: boolean;
  onValueChange?: (checked: boolean) => any;
  label?: React.ReactNode;
  styles?: StylesOf<WebCheckboxComposition>;
} & ComponentVariants<typeof CheckboxStyles>;

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange && onChange(e)
    onValueChange && onValueChange(e.target.checked)
  }

  const variantStyles = useDefaultComponentStyle('Checkbox', {
    responsiveVariants,
    variants,
    styles,
  } as any) as StylesOf<WebCheckboxComposition>

  const { logger } = useCodeleapContext()
  logger.log('Checkbox Style', variantStyles, 'Style')

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
