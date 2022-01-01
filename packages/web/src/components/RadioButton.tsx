import { ReactNode, useRef, ComponentPropsWithoutRef } from 'react'
import {v4} from 'uuid'

import {Text } from './Text'
import { FlatList } from './FlatList'

type RadioItem<T extends unknown = any> = {
    value: T,
    label: ReactNode
}

export type RadioButtonProps = {
    item: RadioItem
    select: () => void
} & ComponentPropsWithoutRef<'input'>

export type RadioGroupProps<T> = {
    data: RadioItem<T>[]
    selected: T
    setSelected(value:T):void
}


export const RadioButton:React.FC<RadioButtonProps> = ({item, select, ...props}) => {
  return <Text component='label' variants={['flex', 'alignCenter']}>
    <input type='radio'value={item.value} onClick={select} {...props}/>
    {typeof item.label === 'string' ? <Text text={item.label} variants={['marginLeft:1']}/> : item.label }
  </Text>
}


export const RadioGroup =  <T extends unknown>({data, selected, setSelected}:RadioGroupProps<T>) => {
  const radioName = useRef(v4()).current

  return <FlatList
    data={data}
    render={({item, idx}) => (
      <RadioButton 
        item={item} 
        key={idx} 
        name={radioName}
        select={() => setSelected(item.value)} 
        checked={selected === item.value}/>
    )
    }
    variants={['column', 'alignStart']}
  />
}
