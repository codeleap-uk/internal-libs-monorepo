import { ReactElement } from 'react'

import {View, ViewProps} from './View'
export type FlatListProps<T> = {
    data: T[]
    render(props: {item:T, idx:number}):ReactElement<any>
} & ViewProps<'div'>

export const FlatList = <T extends unknown>(flatListProps:FlatListProps<T>) => {
  const {data, render, ...viewProps} = flatListProps
  const Component = render
  return <View {...viewProps}>
    {data.map((item, idx) => <Component item={item} idx={idx} key={idx}/>)}
  </View>
}
