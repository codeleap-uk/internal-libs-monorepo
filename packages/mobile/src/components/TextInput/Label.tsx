import React from 'react'
import { useDefaultComponentStyle } from '@codeleap/common'
import { StyleSheet } from 'react-native'
import { Text } from '../Text'
import { View } from '../View'

export const InputLabel = ({ label, variants = [], styles = {}, style, asteriskStyle = null, required = false, wrapperStyle = null }) => {
  const labelStyles = useDefaultComponentStyle('TextInput', {
    variants, styles, transform: StyleSheet.flatten,
  })

  if (!label) return null

  switch (typeof label) {
    case 'string':
      return <View style={ wrapperStyle || labelStyles.labelWrapper}>
        <Text style={style || labelStyles.label} text={label} />
        {required && <Text style={asteriskStyle || labelStyles.requiredAsterisk} text={' *'} />}
      </View>
    case 'object':
      return label
    default:
      return null
  }
}

