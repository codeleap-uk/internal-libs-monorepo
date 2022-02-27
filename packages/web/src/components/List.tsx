import { VariableSizeList as VirtualList } from 'react-window'
import { ComponentProps, CSSProperties, ReactElement } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  ViewComposition,
  ViewStyles,
} from '@codeleap/common'
import { StylesOf } from '../types/utility'
import { CSSObject } from '@emotion/react'

export type ListRender<T> = (itemProps: {
  item: T
  index: number
  style: CSSProperties
}) => ReactElement

export type ListProps<T> = {
  styles?: StylesOf<ViewComposition>
  css?: CSSObject
  data: T[]
  getSize: (i: T, idx: number) => number
  renderItem: ListRender<T>
} & Omit<
  ComponentProps<typeof VirtualList>,
  | 'itemCount'
  | 'itemSize'
  | 'itemData'
  | 'itemHeight'
  | 'width'
  | 'height'
  | 'children'
> &
  ComponentVariants<typeof ViewStyles>

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
    <AutoSizer>
      {({ height, width }) => (
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
