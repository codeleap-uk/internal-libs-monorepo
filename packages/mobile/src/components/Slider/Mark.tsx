import React from 'react'
import { StyleProp } from 'react-native'
import { Text } from '../Text'
import { View } from '../View'
import { SliderMarkProps } from './types'
export const SliderMark: React.FC<SliderMarkProps> = ({
  index,
  sliderProps,
  styles,
  variantStyles,
}) => {
  const { labels = [], showMarks } = sliderProps

  const l = labels?.[index] || ''

  const isFirst = index === 0
  const isLast = index === labels.length - 1

  const centerAdjustWord = -(l.length * 2)

  const markStyles: StyleProp<any> = {}

  const labelStyles: StyleProp<any> = {}

  if (!isFirst && !isLast) {
    labelStyles.left = centerAdjustWord
  }

  if (isLast) {
    labelStyles.right = -20
    markStyles.right = -10
  }
  return (
    <>
      {showMarks ? (
        <View style={[markStyles, variantStyles.mark, styles.mark]} />
      ) : null}
      {l ? (
        <Text
          style={[labelStyles, variantStyles.trackLabels, styles.trackLabels]}
          text={l}
        />
      ) : null}
    </>
  )
}
