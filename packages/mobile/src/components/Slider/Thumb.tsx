import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from '../Text'
import { View } from '../View'
export const ThumbTooltip = ({ children, visible, styles, variantStyles }) => {
  return (
    <View
      style={[
        StyleSheet.flatten([variantStyles.tooltip, styles.tooltip]),
        visible
          ? StyleSheet.flatten([
            variantStyles['tooltip:visible'],
            styles['tooltip:visible'],
          ])
          : StyleSheet.flatten([
            variantStyles['tooltip:hidden'],
            styles['tooltip:hidden'],
          ]),
      ]}
    >
      <Text
        style={[variantStyles.tooltipText, styles.tooltipText]}
        text={children}
      />
      <View style={[variantStyles.tooltipArrow, styles.tooltipArrow]} />
    </View>
  )
}

