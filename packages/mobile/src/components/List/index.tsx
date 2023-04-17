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
  renderItem: (data: ListRenderItemInfo<T>) => React.ReactElement
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
  } & ComponentVariants<typeof ListPresets>

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

    const renderSeparator = useCallback(() => {
      return (
        <View style={variantStyles.separator}></View>
      )
    }, [])

    const isEmpty = !props.data || !props.data.length
    const separator = !isEmpty && props?.separators && renderSeparator

    const Component:any = component || FlatList
    const refreshStyles = StyleSheet.flatten([variantStyles.refreshControl, styles.refreshControl])

    const _listProps = {
      style: [variantStyles.wrapper, style],
      contentContainerStyle: variantStyles.content,
      ref: ref as unknown as FlatList,
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
    }
    const keyboard = useKeyboardAwareView()
    const listProps = keyboard.getKeyboardAwareProps(_listProps, {
      adapt: 'paddingBottom',
      baseStyleProp: 'contentContainerStyle',
      ...keyboardAware,
    })
    return (
      <Component
        {...listProps}
      />
    )
  },
)

export type ListComponentType = <T extends any[] = any[]>(props: FlatListProps<T>) => React.ReactElement

export const List = ListCP as unknown as ListComponentType

