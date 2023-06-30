/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/react'

import React, { forwardRef } from 'react'
import { PropsOf, IconPlaceholder } from '@codeleap/common'
import { StylesOf } from '../../types'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { SegmentedControlComposition } from './styles'
import { Icon, IconProps } from '../Icon'

type OptionRef = PropsOf<typeof Touchable>['ref']

export type SegmentedControlOptionProps = PropsOf<typeof Touchable> & {
  selected?: boolean
  label: string
  variantStyles?: StylesOf<SegmentedControlComposition>
  value?: any
  textProps?: Omit<PropsOf<typeof Text>, 'key'>
  iconProps?: Partial<IconProps>
  icon?: IconPlaceholder
  ref?: OptionRef
}

const SegmentedControlOptionCP = (props: SegmentedControlOptionProps, ref: OptionRef) => {
  const {
    selected,
    onPress,
    style,
    variantStyles = {},
    iconProps = {},
    label,
    icon,
    textProps,
    disabled,
    ...touchableProps
  } = props


  const iconStyles = {
    ...variantStyles.icon as object,
    ...(selected ? variantStyles['icon:selected'] as object : {}),
    ...(disabled ? variantStyles['icon:disabled'] as object : {}),
  }

  return (
    <Touchable
      key={touchableProps.key}
      ref={ref}
      css={[
        variantStyles.button,
        selected && variantStyles['button:selected'],
        disabled && variantStyles['button:disabled'],
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      {...touchableProps}
    >
      {
        !!icon && (
          <Icon
            name={icon}
            style={iconStyles}
            {...iconProps}
          />
        )
      }
      <Text
        text={label}
        css={[
          variantStyles.text,
          selected && variantStyles['text:selected'],
          disabled && variantStyles['text:disabled'],
        ]}
        {...textProps}
      />
    </Touchable>
  )
}

export const SegmentedControlOption = forwardRef(SegmentedControlOptionCP) as ((props: SegmentedControlOptionProps) => JSX.Element)
