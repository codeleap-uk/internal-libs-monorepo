import React from 'react'
import { ComponentVariants, FormTypes, useDefaultComponentStyle } from '@codeleap/common'
import { StylesOf } from '../../types'
import { View, ViewProps } from '../View'
import { InputLabelComposition, InputLabelPresets } from './styles'
import { Text } from '../Text'
import { StyleSheet } from 'react-native'

export type InputLabelProps = ViewProps & {
    styles?: StylesOf<InputLabelComposition>
    label?: FormTypes.Label
    required?: boolean
} & ComponentVariants<typeof InputLabelPresets>

export * from './styles'

export const InputLabel:React.FC<InputLabelProps> = (props) => {
  const { label, required = false, variants = [], styles = {}, style, ...viewProps } = props
  const variantStyles = useDefaultComponentStyle<'u:InputLabel', typeof InputLabelPresets>('u:InputLabel', {
    variants, styles, transform: StyleSheet.flatten,
  })

  if (!label) return null

  switch (typeof label) {
    case 'string':
      return <View {...viewProps} style={[variantStyles.wrapper, style]}>
        <Text style={variantStyles.text} text={label} />
        {required && <Text style={variantStyles.asterisk} text={' *'} />}
      </View>
    case 'object':
      return <>
        {label as React.ReactNode}
      </>
    default:
      return null
  }
}
