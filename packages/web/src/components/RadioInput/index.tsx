import { ReactNode, useRef, ComponentPropsWithoutRef } from 'react'
import {v4} from 'uuid'

import {Text } from '../Text'
import { FlatList } from '../FlatList'
import { Touchable } from '../Touchable'
import { ComponentVariants, RadioInputComposition, RadioInputStyles, StylesOf, useComponentStyle } from '@codeleap/common'
import { View } from '../View'
export { WebRadioInputStyles } from './styles'

type RadioItem<T extends unknown = any> = {
    value: T,
    label: ReactNode
}

const getRadioStyle = (props) => useComponentStyle('RadioInput', props)

export type RadioButtonProps = Omit<ComponentPropsWithoutRef<'input'>, 'style'> & {
    item: RadioItem
    select: () => void
    style: ReturnType<typeof getRadioStyle>
}  

export type RadioGroupProps<T> = {
    data: RadioItem<T>[]
    selected: T
    setSelected(value:T):void
    label:ReactNode
    styles?: StylesOf<RadioInputComposition>
} & ComponentVariants<typeof RadioInputStyles>


export const RadioButton:React.FC<RadioButtonProps> = ({item, select, style, checked, ...props}) => {
  const styleByState = checked ? style['button:checked'] : style['button:unchecked']
  return <Touchable  onPress={select} css={style.itemWrapper}>
    <View  css={{
      ...style.button,
      ...styleByState,
      '&:after': {
        ...style['button:mark'],
        ...styleByState?.['&:after'],
      },
    }}/>
    {typeof item.label === 'string' ? <Text text={item.label} css={style.itemText}/> : item.label }
  </Touchable>
}


export const RadioGroup =  <T extends unknown>(radioGroupProps:RadioGroupProps<T>) => {
  const {data, selected, setSelected, label, responsiveVariants, variants, styles} = radioGroupProps
  const radioName = useRef(v4()).current

  const radioStyle = getRadioStyle({
    responsiveVariants,
    variants,
    styles,
  })

  return <>
    {typeof label === 'string' ? <Text text={label}/> : label }
    <View css={radioStyle.listWrapper}>
      {
        data.map((item, idx) =>  <RadioButton 
          item={item} 
          key={idx} 
          style={radioStyle}
          name={radioName}
          checked={selected === item.value}
          select={() => setSelected(item.value)} 
        />)
      }
    </View>
  </>
}
