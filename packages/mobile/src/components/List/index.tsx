import * as React from 'react'
import { forwardRef } from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  useCallback,
  TypeGuards,
} from '@codeleap/common'

import { FlatListProps as RNFlatListProps, ListRenderItemInfo, StyleSheet, FlatList } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { RefreshControl, RefreshControlProps } from '../RefreshControl'
import { ListComposition, ListPresets } from './styles'
import { StylesOf } from '../../types'

import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { useKeyboardPaddingStyle } from '../../utils'

export type DataboundFlatListPropsTypes = 'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'

export type AugmentedRenderItemInfo<T> = ListRenderItemInfo<T> & {
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
}

export type ReplaceFlatlistProps<P, T> = Omit<P, DataboundFlatListPropsTypes> & {
  data: T[]
  keyExtractor?: (item: T, index: number) => string
  renderItem: (data: AugmentedRenderItemInfo<T>) => React.ReactElement
  onRefresh?: () => void
  getItemLayout?: ((
    data:T,
    index: number,
  ) => { length: number; offset: number; index: number })
  fakeEmpty?: boolean
  loading?: boolean
}

export * from './styles'
export * from './PaginationIndicator'

export type FlatListProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> = ReplaceFlatlistProps<RNFlatListProps<Data>, Data> &
  Omit<ViewProps, 'variants'> & {
    separators?: boolean
    placeholder?: EmptyPlaceholderProps
    styles?: StylesOf<ListComposition>
    refreshControlProps?: Partial<RefreshControlProps>
    fakeEmpty?: boolean
    loading?: boolean
    keyboardAware?: boolean
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
      refreshControlProps = {},
      loading = false,
      keyboardAware = true,
      fakeEmpty = loading,
      contentContainerStyle,
      ...props
    } = flatListProps

    const variantStyles = useDefaultComponentStyle<'u:List', typeof ListPresets>('u:List', {
      variants,
      styles,
      transform: StyleSheet.flatten,

    })

    // const isEmpty = !props.data || !props.data.length
    const separator = props?.separators && <RenderSeparator separatorStyles={variantStyles.separator}/>

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

    const isEmpty = !props.data || !props.data.length

    const _placeholder = {
      ...placeholder,
      loading: TypeGuards.isBoolean(placeholder?.loading) ? placeholder.loading : loading,
    }

    const keyboardStyle = useKeyboardPaddingStyle([
      variantStyles.content,
      contentContainerStyle,
      isEmpty && variantStyles['content:empty'],
    ], keyboardAware && !props.horizontal)

    return (
      <FlatList
        style={[
          variantStyles.wrapper,
          style,
          isEmpty && variantStyles['wrapper:empty'],
        ]}
        contentContainerStyle={keyboardStyle}
        // @ts-expect-error This works
        ItemSeparatorComponent={separator}
        ListHeaderComponentStyle={variantStyles.header}
        refreshControl={!!onRefresh && (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            {...refreshControlProps}
          />
        )}

        ListEmptyComponent={<EmptyPlaceholder {..._placeholder}/>}
        {...props}
        data={fakeEmpty ? [] : props.data}
        ref={ ref }
        renderItem={renderItem}

      />
    )
  },
)

export type ListComponentType = <T extends any[] = any[]>(props: FlatListProps<T>) => JSX.Element

export const List = ListCP as unknown as ListComponentType

