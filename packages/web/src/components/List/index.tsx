import { VariableSizeList as VirtualList , VariableSizeListProps} from 'react-window'
import { ComponentProps, CSSProperties, ReactElement } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import {
  ComponentVariants,
  useDefaultComponentStyle
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { CSSObject } from '@emotion/react'
import { ListComposition, ListPresets } from './styles'

export type ListRender<T> = (itemProps: {
  item: T
  index: number
  style: CSSProperties
}) => ReactElement

export * from './styles'

export type ListProps<T> = {
  styles?: StylesOf<ListComposition>
  css?: CSSObject
  data: T[]
  getSize: (i: T, idx: number) => number
  renderItem: ListRender<T>
} & Omit<
  VariableSizeListProps,
  | 'itemCount'
  | 'itemSize'
  | 'itemData'
  | 'itemHeight'
  | 'width'
  | 'height'
  | 'children'
> &
  ComponentVariants<typeof ListPresets>

export const List = <T extends unknown>(
  listProps: ListProps<T>,
) => {
  const {
    variants,
    responsiveVariants,
    styles,
    data,
    getSize,
    renderItem: Item,
    ...viewProps
  } = listProps

  const variantStyles = useDefaultComponentStyle('View', {
    variants,
    responsiveVariants,
    styles,
  })

  return (
    // @ts-ignore
    <AutoSizer>
      {({ height, width }) => (
        // @ts-ignore
        <VirtualList
          height={height}
          width={width}
          itemCount={data.length}
          itemData={data}
          itemSize={(idx) => getSize(data[idx], idx)}
          css={variantStyles.wrapper}
          {...viewProps}
        >
          {({ style, index }) => (
            <Item item={data[index]} style={style} index={index} />
          )}
        </VirtualList>
      )}
    </AutoSizer>
  )

  // return <View {...viewProps}>
  //   {data.map((item, idx) => <Component item={item} idx={idx} key={idx}/>)}
  // </View>
}

// const rowHeights = new Array(1000)
//   .fill(true)
//   .map(() => 25 + Math.round(Math.random() * 50));

// const getItemSize = index => rowHeights[index];

// const Row = ({ index, style }) => (
//   <div style={style}>Row {index}</div>
// );

// const Example = () => (
//   <List
//     height={150}
//     itemCount={1000}
//     itemSize={getItemSize}
//     width={300}
//   >
//     {Row}
//   </List>
// );
