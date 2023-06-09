import React from 'react'
import { PropsOf } from '@codeleap/common'
import { StylesOf } from '../../types'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { SegmentedControlComposition } from './styles'

export interface SegmentedControlOptionProps {
  selected?: boolean
  label: string
  value: string
  variantStyles?: StylesOf<SegmentedControlComposition>
  textProps?: Omit<PropsOf<typeof Text>, 'key'>
}

export const SegmentedControlOption = (props: SegmentedControlOptionProps) => {

  const { selected, onPress, style, variantStyles, label, value, textProps, ...touchableProps } = props

  return (
    <Touchable
      noFeedback={selected}
      key={touchableProps.key}
      styles={{
        feedback: variantStyles.buttonFeedback,
      }}
      style={[variantStyles.button, selected && variantStyles['button:selected'], style]}
      onPress={onPress}
    >
      <Text
        text={label}
        style={[
          variantStyles.text,
          selected && variantStyles['text:selected'],
          touchableProps?.disabled && variantStyles['text:disabled'],
        ]}
        {...textProps}
      />

    </Touchable>
  )
}
