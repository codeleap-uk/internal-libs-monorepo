import React from 'react'
import { PropsOf, IconPlaceholder } from '@codeleap/common'
import { StylesOf } from '../../types'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { SegmentedControlComposition } from './styles'
import { Icon } from '../Icon'

export type SegmentedControlOptionProps = PropsOf<typeof Touchable> & {
  selected?: boolean
  label: string
  variantStyles?: StylesOf<SegmentedControlComposition>
  textProps?: Omit<PropsOf<typeof Text>, 'key'>
  icon?: IconPlaceholder
}

export const SegmentedControlOption = (props: SegmentedControlOptionProps) => {

  const { selected, onPress, style, variantStyles, label, icon, textProps, maxDivWidthRef, ...touchableProps } = props

  return (
    <Touchable
      noFeedback={selected}
      key={touchableProps.key}
      style={{
        feedback: variantStyles.buttonFeedback,
      }}
      ref={(ref) => {
        if (ref && ref.offsetWidth > maxDivWidthRef.current) {
          maxDivWidthRef.current = ref.offsetWidth
        }
      }}
      css={[
        variantStyles.button,
        selected &&
        variantStyles['button:selected'],
        touchableProps?.disabled &&
        variantStyles['button:disabled'],
        style,
      ]}
      onPress={onPress}
      {...touchableProps}
    >
      {
        !!icon && (
          <Icon name={icon} css={[variantStyles.icon, selected && variantStyles['icon:selected']]} />
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
