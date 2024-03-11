import React from 'react'

type RenderItemProps<T extends object> = {
  item: T
  isFirst: boolean
  isLast: boolean
  index: number
}

export type MapperProps<P extends object, T extends object> = {
  data: T[]
  itemProps?: P
  renderItem: (props: RenderItemProps<T> & P) => JSX.Element
  keyExtractor?: (item: T, index: number) => any
  separator?: React.ReactElement
}

export function Mapper<P extends object, T extends object>(props: MapperProps<P, T>) {
  const {
    data = [],
    renderItem: Item,
    keyExtractor = (item: any, index) => (item?.id ?? index),
    itemProps = {},
    separator = null
  } = props

  if (!data || !Array.isArray(data)) return null

  return <>
    {data?.map((item, index, arr) => {
      const key = keyExtractor(item, index)

      return <>
        {index == 0 ? null : separator}

        <Item
          key={key}
          item={item}
          index={index}
          isFirst={index == 0}
          isLast={index == arr?.length - 1}
          {...itemProps as P}
        />
      </>
    })}
  </>
}
