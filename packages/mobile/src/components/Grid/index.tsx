import * as React from 'react'
import { forwardRef } from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  useCallback,
  useCodeleapContext,
} from '@codeleap/common'

import { StyleSheet, ListRenderItemInfo } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { RefreshControl } from '../RefreshControl'
import { List } from '../List'
import { GridPresets } from './styles'
import { FlatListProps, AugmentedRenderItemInfo } from '../List'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

export * from './styles'

export type DataboundFlatGridPropsTypes = 'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'

export type GridAugmentedRenderItemInfo<T> = AugmentedRenderItemInfo<T> & {
  isFirstInRow: boolean
  isLastInRow: boolean
  isOnlyInRow: boolean
}

export type GridProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> = Omit<FlatListProps<T, Data>, 'variants' | 'renderItem'> & ComponentVariants<typeof GridPresets> & {
  spacing?: number
  itemDimension?: number
  renderItem: (data: GridAugmentedRenderItemInfo<T>) => React.ReactElement
}

const RenderSeparator = (props: { separatorStyles: ViewProps['style'] }) => {
  return (
    <View style={props.separatorStyles}></View>
  )
}

const GridCP = forwardRef<KeyboardAwareFlatList, GridProps>(
  (flatGridProps, ref) => {
    const {
      variants = [],
      style,
      styles = {},
      onRefresh,
      refreshing,
      placeholder,
      refreshControlProps = {},
      spacing,
      numColumns,
      ...props
    } = flatGridProps
    const { Theme } = useCodeleapContext()
    const variantStyles = useDefaultComponentStyle<'u:Grid', typeof GridPresets>('u:Grid', {
      variants,
      styles,
      transform: StyleSheet.flatten,
    })

    const renderItem = useCallback((data: ListRenderItemInfo<any>) => {
      if (!props?.renderItem) return null
      const listLength = props?.data?.length || 0

      const isFirst = data.index === 0
      const isLast = data.index === listLength - 1
      const isOnly = isFirst && isLast

      const idx = data.index + 1
      const isLastInRow = !isFirst && idx % (numColumns) === 0
      const isFirstInRow = isFirst || data.index % numColumns === 0
      const isOnlyInRow = !isFirstInRow && !isLastInRow

      let gap = Theme.spacing.marginRight(spacing / 2)
      if (isLastInRow) gap = Theme.spacing.marginLeft(spacing / 2)
      else if (isOnlyInRow) gap = Theme.spacing.marginHorizontal(spacing / 2)

      return (
        <View style={{ ...variantStyles.itemWrapper, ...gap }}>
          {props?.renderItem({
            ...data,
            isFirst, isLast, isOnly,
            isFirstInRow, isLastInRow, isOnlyInRow,
          })}
        </View>
      )
    }, [props?.renderItem, props?.data?.length])

    const separatorStyles = { height: Theme.spacing.value(spacing), ...variantStyles.separator }
    const separator = props?.separators || spacing && <RenderSeparator separatorStyles={separatorStyles}/>
    const refreshControl = !!onRefresh && <RefreshControl refreshing={refreshing} onRefresh={onRefresh} {...refreshControlProps}/>
    const _gridProps = {
      ...props,
      ref: ref,
      ListEmptyComponent: <EmptyPlaceholder {...placeholder}/>,
      ListHeaderComponentStyle: variantStyles.header,
      ListFooterComponentStyle: variantStyles.footer,
      ItemSeparatorComponent: separator,
      refreshControl,
      style: [variantStyles.wrapper, style],
      contentContainerStyle: variantStyles.content,
      showsVerticalScrollIndicator: false,
      numColumns,
      renderItem,
    }

    return (
      // @ts-ignore
      <List
        {..._gridProps}
      />
    )
  },
)

export type GridComponentType = <T extends any[] = any[]>(props: GridProps<T>) => React.ReactElement

export const Grid = GridCP as unknown as GridComponentType

