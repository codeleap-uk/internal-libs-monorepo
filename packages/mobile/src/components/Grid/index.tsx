import * as React from 'react'
import { forwardRef } from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  useCallback,
} from '@codeleap/common'

import { GridRenderItemInfo } from 'react-native-super-grid'
import { StyleSheet, ListRenderItemInfo } from 'react-native'
import { View } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { RefreshControl } from '../RefreshControl'
import { List } from '../List'
import { GridPresets } from './styles'
import { FlatListProps } from '../List'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

export type DataboundFlatGridPropsTypes = 'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'

export type ReplaceFlatGridProps<P, T> = Omit<P, DataboundFlatGridPropsTypes> & {
  data: T[]
  keyExtractor?: (item: T, index: number) => string
  renderItem: (data: GridRenderItemInfo<T>) => React.ReactElement
  onRefresh?: () => void
  getItemLayout?: ((
    data:T,
    index: number,
) => { length: number; offset: number; index: number })
}

export * from './styles'
export type GridProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> = {
  spacing?: number
} & FlatListProps<T, Data> & ComponentVariants<typeof GridPresets>

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
      spacing
      ...props
    } = flatGridProps

    const variantStyles = useDefaultComponentStyle<'u:Grid', typeof GridPresets>('u:Grid', {
      variants,
      styles,
      transform: StyleSheet.flatten,

    })

    const spacings = useMemo(() => {
      return childArr.map((_, idx) => {
        let spacingFunction = horizontal ? 'marginHorizontal' : 'marginVertical'
  
        switch (idx) {
          case 0:
            spacingFunction = horizontal ? 'marginRight' : 'marginBottom'
            break
          case childArr.length - 1:
            spacingFunction = horizontal ? 'marginLeft' : 'marginTop'
            break
          default:
            break
        }
  
        return Theme.spacing[spacingFunction](value / 2)
      })
  
    }, [childArr.length, horizontal])

    const renderItem = useCallback((data: ListRenderItemInfo<any>) => {
      if (!props?.renderItem) return null
      const listLength = props?.data?.length || 0

      const isFirst = data.index === 0
      const isLast = data.index === listLength - 1

      const isOnly = isFirst && isLast

      return props?.renderItem({
        ...data,
        isFirst,
        isLast,
        isOnly,
      })
    }, [props?.renderItem, props?.data?.length])

    const separator = props?.separators && <RenderSeparator separatorStyles={variantStyles.separator}/>
    const refreshControl = !!onRefresh && <RefreshControl refreshing={refreshing} onRefresh={onRefresh} {...refreshControlProps}/>
    const _gridProps = {
      ref: ref,
      ListEmptyComponent: <EmptyPlaceholder {...placeholder}/>,
      // ItemSeparatorComponent: separator,
      refreshControl,
      renderItem,
      style: [variantStyles.wrapper, style],
      contentContainerStyle: variantStyles.content,
      showsVerticalScrollIndicator: false,
      ...props,
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

