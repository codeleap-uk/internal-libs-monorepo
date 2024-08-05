import React from 'react'
import { PropsOf } from '@codeleap/common'
import { StylesOf } from '../../types'
import { Text } from '../Text'
import { Touchable, TouchableProps } from '../Touchable'
import { SegmentedControlComposition } from './styles'
import { Icon } from '../Icon'
import { AppIcon } from '@codeleap/styles'

export type SegmentedControlOptionProps = Omit<TouchableProps, 'debugName'> & {
  selected?: boolean
  label: string
  value: string
  variantStyles?: StylesOf<SegmentedControlComposition>
  textProps?: Omit<PropsOf<typeof Text>, 'key'>
  icon?: AppIcon
  badge?: React.ReactNode
  debugName?: string
}

export const SegmentedControlOption = (props: SegmentedControlOptionProps) => {
  const {
    selected,
    onPress,
    debugName,
    style,
    variantStyles,
    label,
    value,
    icon,
    textProps,
    badge = null,
    ...touchableProps
  } = props

  return (
    <Touchable
      debugName={`Segmented Control ${debugName}, option ${label}`}
      noFeedback={selected}
      style={[
        variantStyles?.button,
        selected && variantStyles['button:selected'],
        style,
        {
          feedback: variantStyles.buttonFeedback,
        }
      ]}
      onPress={onPress}
      {...touchableProps}
    >
      {!!icon ? <Icon name={icon} style={variantStyles?.icon} /> : null}

      <Text
        text={label}
        style={[
          variantStyles?.text,
          selected && variantStyles['text:selected'],
          touchableProps?.disabled && variantStyles['text:disabled'],
        ]}
        {...textProps}
      />

      {badge}
    </Touchable>
  )
}
