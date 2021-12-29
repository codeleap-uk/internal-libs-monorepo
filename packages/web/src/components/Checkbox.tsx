/** @jsx jsx */
import {  jsx } from '@emotion/react'
import { CheckboxStyles, ComponentVariants, useComponentStyle } from '@codeleap/common'
import { ComponentPropsWithRef } from 'react'
import { Touchable } from './Touchable'

type NativeCheckboxProps = ComponentPropsWithRef<'input'>

export type CheckboxProps = NativeCheckboxProps & {
    checked?:boolean
    onValueChange?: (checked:boolean) => any
} & ComponentVariants<typeof CheckboxStyles>

export const Checkbox = (checkboxProps:CheckboxProps) => {
  const {checked, onValueChange, variants= [], responsiveVariants = {}, onChange, ...props} = checkboxProps

  function handleChange(e:React.ChangeEvent<HTMLInputElement>){
    onChange && onChange(e)
    onValueChange && onValueChange(e.target.checked)
  }

  const variantStyles = useComponentStyle('Checkbox', {
    rootElement: 'wrapper',
    responsiveVariants,
    variants,
  })

  return <Touchable css={{...variantStyles.wrapper }}>
    <input {...props} css={variantStyles.input} onChange={handleChange}  type='checkbox' checked={checked}/>
  </Touchable>
}
