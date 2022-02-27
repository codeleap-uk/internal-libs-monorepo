import * as React from 'react'
import { ReactNode, useRef, ComponentPropsWithoutRef } from 'react'
import { v4 } from 'uuid'

import { Text } from '../Text'
import { Touchable } from '../Touchable'
import {
  ComponentVariants,
  StylesOf,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { View } from '../View'
import { MobileRadioInputStyles, MobileRadioInputComposition } from './styles'

export * from './styles'

type RadioItem<T extends unknown = any> = {
  value: T
  label: ReactNode
}

const getRadioStyle = (props) => useDefaultComponentStyle('RadioInput', props)

export type RadioButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Touchable>,
  'style'
> & {
  item: RadioItem
  select: () => void
  style: StylesOf<MobileRadioInputComposition>
  checked: boolean
  defaultValue?: number
}

export type RadioGroupProps<T> = {
  options: RadioItem<T>[]
  value: T
  onValueChange(value: T): void
  label: ReactNode
  styles?: StylesOf<MobileRadioInputComposition>
} & ComponentVariants<typeof MobileRadioInputStyles>

export const RadioButton: React.FC<RadioButtonProps> = ({
  item,
  select,
  style,
  checked,
  ...props
}) => {
  return (
    <Touchable onPress={select} style={style.itemWrapper} debugName={'Change radioButton value'}>
      <View style={[style.button, checked && style['button:checked']]}>
        <View
          style={[style.buttonMark, checked && style['buttonMark:checked']]}
        />
      </View>
      {typeof item.label === 'string' ? (
        <Text text={item.label} style={style.text} />
      ) : (
        item.label
      )}
    </Touchable>
  )
}

export const RadioGroup = <T extends unknown>(
  radioGroupProps: RadioGroupProps<T>,
) => {
  const {
    options,
    value,
    onValueChange,
    label,
    responsiveVariants,
    variants,
    styles,
  } = radioGroupProps

  const radioStyle = getRadioStyle({
    responsiveVariants,
    variants,
    styles,
  })
  return (
    <View style={radioStyle.wrapper}>
      {typeof label === 'string' ? <Text text={label} /> : label}
      <View style={radioStyle.listWrapper}>
        {options?.map((item, idx) => (
          <RadioButton
            debugName={'RadioButton'}
            item={item}
            key={idx}
            style={radioStyle}
            checked={value === item.value}
            select={() => onValueChange(item.value)}
          />
        ))}
      </View>
    </View>
  )
}
