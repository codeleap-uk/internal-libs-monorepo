import React from 'react'
import { IconPlaceholder, PropsOf } from '@codeleap/common'
import { StylesOf } from '../../types'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { Gap, View } from '../View'
import { SegmentedControlComposition } from './styles'
import { Icon } from '../Icon'

export type SegmentedControlOptionProps = PropsOf<typeof Touchable> & {
  selected?: boolean
  label: string
  value: string
  variantStyles?: StylesOf<SegmentedControlComposition>
  textProps?: Omit<PropsOf<typeof Text>, 'key'>
  icon?: IconPlaceholder
}

export const SegmentedControlOption = (props: SegmentedControlOptionProps) => {
  const { selected, onPress, debugName, style, variantStyles, label, value, icon, textProps, ...touchableProps } = props

  return <Touchable
    debugName={`Segmented Control ${debugName}, option ${label}`}
    noFeedback={selected}
    key={touchableProps.key}
    styles={{
      feedback: variantStyles.buttonFeedback,
    }}
    style={[variantStyles.button, selected && variantStyles['button:selected'], style]}
    onPress={onPress}
  >

    {!!icon ? (
      <>
        <Icon name={icon} style={[variantStyles.icon]} />

        <Text
          text={label}
          style={[
            variantStyles.text,
            selected && variantStyles['text:selected'],
            touchableProps?.disabled && variantStyles['text:disabled'],
          ]}
          {...textProps}
        />
      </>) : (
      <>
        <Text
          text={label}
          style={[
            variantStyles.text,
            selected && variantStyles['text:selected'],
            touchableProps?.disabled && variantStyles['text:disabled'],
          ]}
          {...textProps}
        />
      </>
    )}

  </Touchable>
}
