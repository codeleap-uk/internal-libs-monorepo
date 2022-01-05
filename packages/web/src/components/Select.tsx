/** @jsx jsx */
import { jsx } from '@emotion/react';
import { SelectStyles, ComponentVariants, useComponentStyle, StylesOf, SelectComposition } from '@codeleap/common';
import { ComponentPropsWithRef } from 'react';
import { View, ViewProps } from './View';


type NativeSelectProps = ComponentPropsWithRef<'select'>;
type Option = {
  label: string;
  value: string | number;
}

export type SelectProps = NativeSelectProps & {
  options: Array<Option>
  styles?: StylesOf<SelectComposition>
  wrapperProps?: ViewProps<'div'>
} & ComponentVariants<typeof SelectStyles>; 

export const Select = (selectProps:SelectProps) => {
  const {
    variants = [],
    responsiveVariants = {},
    options,
    styles,
    wrapperProps,
    ...props
  } = selectProps;

  const variantStyles = useComponentStyle('Select', {
    responsiveVariants,
    variants,
    styles,
  })

  return (
    <View css={variantStyles.wrapper} {...wrapperProps}>
      <View component='select' css={variantStyles.select} {...props}>
        {options.map((option, index) => (
          <option value={option.value} key={index}>
            {option.label}
          </option>
        ))}
      </View>
    </View>
  )
}
