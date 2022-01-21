/** @jsx jsx */
import {  jsx } from '@emotion/react'
import { CheckboxComposition, CheckboxStyles, ComponentVariants, StylesOf, useComponentStyle, useStyle } from '@codeleap/common'
import { ComponentPropsWithRef } from 'react'
import { View } from './View'
import { Text } from './Text'

type NativeCheckboxProps = ComponentPropsWithRef<'input'>

export type CheckboxProps = NativeCheckboxProps & {
    checked?:boolean
    onValueChange?: (checked:boolean) => any
    label?: React.ReactNode
    styles?:StylesOf<CheckboxComposition>
} & ComponentVariants<typeof CheckboxStyles>

export const Checkbox = (checkboxProps:CheckboxProps) => {
  const {checked, onValueChange, variants= [], responsiveVariants = {}, label, onChange, styles, ...props} = checkboxProps

  function handleChange(e:React.ChangeEvent<HTMLInputElement>){
    onChange && onChange(e)
    onValueChange && onValueChange(e.target.checked)
  }

  const variantStyles = useComponentStyle('Checkbox', {
    responsiveVariants,
    variants,
    styles,
  })
  
  const {logger} = useStyle()
  logger.log('Checkbox Style', variantStyles, 'Style')
  
  return <View component='label' css={{...variantStyles.wrapper }} >
    <input {...props} css={variantStyles.input}  onChange={handleChange}  type='checkbox' checked={checked}/>
    <span className='checkbox-label' css={{
      ...variantStyles.checkmarkWrapper,
      '&:after': {
        ...variantStyles.checkmark,
      },
    }}/>
    {
      typeof label === 'string' ?  <Text  text={label}  styles={{text: variantStyles.label}}/> : label
    }
  </View>
}
