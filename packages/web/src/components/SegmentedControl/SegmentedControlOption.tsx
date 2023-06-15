import React from 'react'
import { PropsOf, IconPlaceholder } from '@codeleap/common'
import { StylesOf } from '../../types'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { View } from '../View'
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

  const { selected, onPress, style, variantStyles, label, icon, value, textProps, ...touchableProps } = props

  console.log({ variantStyles })

  return (
    <Touchable
      noFeedback={selected}
      key={touchableProps.key}
      styles={{
        feedback: variantStyles.buttonFeedback,
      }}
      css={[variantStyles.button, selected && variantStyles['button:selected'], style]}
      onPress={onPress}
    >
      {
        !!icon && (
          <Icon name={icon} css={[variantStyles.icon]} />
        )
      }
      <Text
        text={label}
        css={[
          variantStyles.text,
          selected && variantStyles['text:selected'],
          touchableProps?.disabled && variantStyles['text:disabled'],
        ]}
        {...textProps}
      />
    </Touchable>
  )
}
