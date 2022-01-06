/** @jsx jsx */
import { jsx } from '@emotion/react';
import { SelectStyles, ComponentVariants, useComponentStyle, StylesOf, SelectComposition } from '@codeleap/common';
import { ComponentPropsWithRef } from 'react';

type NativeSelectProps = ComponentPropsWithRef<'select'>;
type Option = {
  label: string;
  value: string | number;
}

export type SelectProps = NativeSelectProps & {
  options: Array<Option>
  styles?: StylesOf<SelectComposition>
  placeholder?: string
} & ComponentVariants<typeof SelectStyles>;

export const Select = (selectProps:SelectProps) => {
  const {
    variants = [],
    responsiveVariants = {},
    options,
    styles,
    placeholder,
  } = selectProps;

  const variantStyles = useComponentStyle('Select', {
    responsiveVariants,
    variants,
    styles,
  })

  return (
    <div css={variantStyles.wrapper}>
      {placeholder && (
        <label css={variantStyles.label}>
          {placeholder}
        </label>
      )}
      <select css={variantStyles.select}>
        {options.map((option, index) => (
          <option value={option.value} key={index}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
