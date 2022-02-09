import { VariableSizeList as List } from "react-window";
import { ComponentProps, CSSProperties, ReactElement } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  ComponentVariants,
  useComponentStyle,
  ViewComposition,
  ViewStyles,
} from "@codeleap/common";
import { StylesOf } from "../types/utility";
import { CSSObject } from "@emotion/react";

export type FlatListRender<T> = (itemProps: {
  item: T;
  index: number;
  style: CSSProperties;
}) => ReactElement;

export type FlatListProps<T> = {
  styles?: StylesOf<ViewComposition>;
  css?: CSSObject;
  data: T[];
  getSize: (i: T, idx: number) => number;
  renderItem: FlatListRender<T>;
} & Omit<
  ComponentProps<typeof List>,
  | "itemCount"
  | "itemSize"
  | "itemData"
  | "itemHeight"
  | "width"
  | "height"
  | "children"
> &
  ComponentVariants<typeof ViewStyles>;

export const FlatList = <T extends unknown>(
  flatListProps: FlatListProps<T>
) => {
  const {
    variants,
    responsiveVariants,
    styles,
    data,
    getSize,
    renderItem: Item,
    ...viewProps
  } = flatListProps;

  const variantStyles = useComponentStyle("View", {
    variants,
    responsiveVariants,
    styles,
  });

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
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
        </List>
      )}
    </AutoSizer>
  );

  // return <View {...viewProps}>
  //   {data.map((item, idx) => <Component item={item} idx={idx} key={idx}/>)}
  // </View>
};

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
