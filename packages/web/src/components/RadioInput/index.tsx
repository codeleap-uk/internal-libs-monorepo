import { ReactNode, useRef, ComponentPropsWithoutRef } from 'react'
import { v4 } from 'uuid'

import { Text } from '../Text'
import { Touchable } from '../Touchable'
import {
  ComponentVariants,
  RadioInputComposition,
  RadioInputStyles,
  StylesOf,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { View } from '../View'
export { WebRadioInputStyles } from './styles'

type RadioItem<T extends unknown = any> = {
  value: T
  label: ReactNode
}

const getRadioStyle = (props) => useDefaultComponentStyle('RadioInput', props)

export type RadioButtonProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'style'
> & {
  item: RadioItem
  select: () => void
  style: StylesOf<RadioInputComposition>
}

export type RadioGroupProps<T> = {
  options: RadioItem<T>[]
  value: T
  onValueChange(value: T): void
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
  const styleByState = checked
    ? style['button:checked']
    : style['button:unchecked']
  return (
    <Touchable onPress={select} css={style.itemWrapper}>
      <View
        css={{
          ...style.button,
          ...styleByState,
          '&:after': {
            ...style['button:mark'],
            ...styleByState?.['&:after'],
          },
        }}
      />
      {typeof item.label === 'string' ? (
        <Text text={item.label} css={style.itemText} />
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
  const radioName = useRef(v4()).current

  const radioStyle = getRadioStyle({
    responsiveVariants,
    variants,
    styles,
  })
  return (
    <View css={radioStyle.wrapper}>
      {typeof label === 'string' ? <Text text={label} /> : label}
      <View css={radioStyle.listWrapper}>
        {options?.map((item, idx) => (
          <RadioButton
            item={item}
            key={idx}
            style={radioStyle}
            name={radioName}
            checked={value === item.value}
            select={() => onValueChange(item.value)}
          />
        ))}
      </View>
    </View>
  )
}
