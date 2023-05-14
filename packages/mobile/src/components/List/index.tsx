import * as React from 'react'
import { forwardRef } from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  useCallback,
} from '@codeleap/common'

import { RefreshControl, FlatList, FlatListProps as RNFlatListProps, ListRenderItemInfo, StyleSheet, RefreshControlProps } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { ListComposition, ListPresets } from './styles'
import { StylesOf } from '../../types'
import { useKeyboardAwareView, GetKeyboardAwarePropsOptions } from '../../utils'

export type DataboundFlatListPropsTypes = 'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'

export type ReplaceFlatlistProps<P, T> = Omit<P, DataboundFlatListPropsTypes> & {
  data: T[]
  keyExtractor?: (item: T, index: number) => string
  renderItem: (data: ListRenderItemInfo<T> & {isFirst: boolean; isLast: boolean}) => React.ReactElement
  onRefresh?: () => void
  getItemLayout?: ((
    data:T,
    index: number,
) => { length: number; offset: number; index: number })
}

export * from './styles'
export * from './PaginationIndicator'

export type FlatListProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> =RNFlatListProps<Data> &
  Omit<ViewProps, 'variants'> & {
    separators?: boolean
    placeholder?: EmptyPlaceholderProps
    keyboardAware?: GetKeyboardAwarePropsOptions
    styles?: StylesOf<ListComposition>
    refreshControlProps?: Partial<RefreshControlProps>
    renderItem: (data: ListRenderItemInfo<T> & {isFirst: boolean; isLast: boolean}) => React.ReactElement
  } & ComponentVariants<typeof ListPresets>

const RenderSeparator = (props: { separatorStyles: ViewProps['style'] }) => {
  return (
    <View style={props.separatorStyles}></View>
  )
}

const ListCP = forwardRef<FlatList, FlatListProps>(
  (flatListProps, ref) => {
    const {
      variants = [],
      style,
      styles = {},
      onRefresh,
      component,
      refreshing,
      placeholder,
      keyboardAware,
      refreshControlProps = {},
      ...props
    } = flatListProps

    const variantStyles = useDefaultComponentStyle<'u:List', typeof ListPresets>('u:List', {
      variants,
      styles,
      transform: StyleSheet.flatten,

    })

    // const isEmpty = !props.data || !props.data.length
    const separator = props?.separators && <RenderSeparator separatorStyles={variantStyles.separator}/>
    const RenderItem = props.renderItem

    const Component:any = component || FlatList
    const refreshStyles = StyleSheet.flatten([variantStyles.refreshControl, styles.refreshControl])

    const _listProps = {
      style: [variantStyles.wrapper, style],
      contentContainerStyle: variantStyles.content,
      showsVerticalScrollIndicator: false,
      ref: ref as unknown as FlatList,
      ListHeaderComponentStyle: variantStyles.header,
      ItemSeparatorComponent: separator,
      refreshControl: !!onRefresh && (
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={refreshStyles?.color}
          colors={[refreshStyles?.color]}
          {...refreshControlProps}
        />
      ),
      ListEmptyComponent: <EmptyPlaceholder {...placeholder}/>,
      ...props,
      renderItem: (defaultProps) => {
        const idx = defaultProps.index
        const isFirst = idx === 0
        const isLast = idx === props.data.length - 1
        return <RenderItem {...defaultProps} isFirst={isFirst} isLast={isLast} />
      },
    }

    return (
      <Component
        {..._listProps}
      />
    )
  },
)

export type ListComponentType = <T extends any[] = any[]>(props: FlatListProps<T>) => React.ReactElement

export const List = ListCP as unknown as ListComponentType

