import * as React from 'react'
import { forwardRef, useState } from 'react'
import {

  useDefaultComponentStyle,

  ComponentVariants,
} from '@codeleap/common'


import { RefreshControl, FlatList, FlatListProps as RNFlatListProps, ListRenderItemInfo, StyleSheet, RefreshControlProps } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { ListComposition, ListStyles } from './styles'
import { StylesOf } from '../../types'
import { KeyboardAwareFlatList } from '../../utils'

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
    keyboardAware?: boolean
    styles?: StylesOf<ListComposition>
    refreshControlProps?: Partial<RefreshControlProps>
  } & ComponentVariants<typeof ListStyles>

const ListCP = forwardRef<FlatList, FlatListProps>(
  (flatListProps, ref) => {
    const {
      variants = [],
      style,
      styles = {},
      onRefresh,
      refreshing,
      placeholder,
      keyboardAware = true,
      refreshControlProps = {},
      ...props
    } = flatListProps

    const variantStyles = useDefaultComponentStyle<'u:List', typeof ListStyles>('u:List', {
      variants,
      styles,
      transform: StyleSheet.flatten,

    })

    const renderSeparator = () => {
      return (
        <View variants={['separator']}></View>
      )
    }

    const separatorProp = props.separators
    const isEmpty = !props.data || !props.data.length
    const separator = !isEmpty && separatorProp == true && renderSeparator

    const Component:any = keyboardAware ? KeyboardAwareFlatList : FlatList
    const refreshStyles = StyleSheet.flatten([variantStyles.refreshControl, styles.refreshControl])

    return (
      <Component
        style={[variantStyles.wrapper, style]}
        contentContainerStyle={variantStyles.content}
        ref={ref as unknown as FlatList}
        ItemSeparatorComponent={separator}
        refreshControl={
          !!onRefresh && (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={refreshStyles?.color}
              colors={[refreshStyles?.color]}
              {...refreshControlProps}
            />
          )
        }

        ListEmptyComponent={<EmptyPlaceholder {...placeholder}/>}
        {...props}
      />
    )
  },
)

export type ListComponentType = <T extends any[] = any[]>(props: FlatListProps<T>) => React.ReactElement

export const List = ListCP as ListComponentType

