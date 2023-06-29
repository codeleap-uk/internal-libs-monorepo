import React from 'react'
import { IconPlaceholder, PropsOf } from '@codeleap/common'
import { StylesOf } from '../../types'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { SegmentedControlComposition } from './styles'
import { Icon } from '../Icon'

export type SegmentedControlOptionProps = PropsOf<typeof Touchable> & {
  selected?: boolean
  label: string
  value: string
  variantStyles?: StylesOf<SegmentedControlComposition>
  textProps?: Omit<PropsOf<typeof Text>, 'key'>
  icon?: IconPlaceholder
  badge?: React.ReactNode
}

export const SegmentedControlOption = (props: SegmentedControlOptionProps) => {
  const { selected, onPress, debugName, style, variantStyles, label, value, icon, textProps, badge = null, ...touchableProps } = props

  return <Touchable
    debugName={`Segmented Control ${debugName}, option ${label}`}
    noFeedback={selected}

    styles={{
      feedback: variantStyles.buttonFeedback,
    }}
    style={[variantStyles.button, selected && variantStyles['button:selected'], style]}
    onPress={onPress}
    {...touchableProps}
  >
    {
      !!icon && (
        <Icon name={icon} style={[variantStyles.icon]} />

      )
    }
    <Text
      text={label}
      style={[
        variantStyles.text,
        selected && variantStyles['text:selected'],
        touchableProps?.disabled && variantStyles['text:disabled'],
      ]}
      {...textProps}
    />
    { badge }

  </Touchable>
}
