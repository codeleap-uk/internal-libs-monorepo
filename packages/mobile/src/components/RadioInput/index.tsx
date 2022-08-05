import * as React from 'react'
import { ReactNode, ComponentPropsWithoutRef } from 'react'

import { Text } from '../Text'
import { Touchable } from '../Touchable'
import {
  ComponentVariants,
  getNestedStylesByKey,
  StylesOf,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { View } from '../View'
import { RadioInputComposition, RadioInputStyles } from './styles'
import { InputLabel } from '../InputLabel'

export * from './styles'

type RadioItem<T extends unknown = any> = {
  value: T
  label: ReactNode
}

const getRadioStyle = (props) => useDefaultComponentStyle<'u:RadioInput', typeof RadioInputStyles>('u:RadioInput', props)

export type RadioButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Touchable>,
  'style'
> & {
  item: RadioItem
  select: () => void
  style: StylesOf<RadioInputComposition>
  checked: boolean
  defaultValue?: number
}

export type RadioGroupProps<T> = {
  options: RadioItem<T>[]
  value: T
  onValueChange(value: T): void
  required?: boolean
  label: ReactNode
  styles?: StylesOf<RadioInputComposition>
} & ComponentVariants<typeof RadioInputStyles>

export const RadioButton: React.FC<RadioButtonProps> = ({
  item,
  select,
  style,
  checked,
  ...props
}) => {
  return (
    <Touchable onPress={select} style={style.itemWrapper} debugName={'Change radioButton value'} styles={{
      feedback: style.buttonFeedback,
    }}>
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
    required = false,
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
      <InputLabel required={required} label={label} styles={getNestedStylesByKey('label', radioStyle)}/>
      <View style={radioStyle.list}>
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
