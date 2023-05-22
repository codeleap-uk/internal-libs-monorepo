import * as React from 'react'
import { forwardRef } from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  useCallback,
} from '@codeleap/common'

import { RefreshControl, FlatListProps as RNFlatListProps, ListRenderItemInfo, StyleSheet, RefreshControlProps } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { ListComposition, ListPresets } from './styles'
import { StylesOf } from '../../types'

import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

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
  } & ComponentVariants<typeof ListPresets>

const RenderSeparator = (props: { separatorStyles: ViewProps['style'] }) => {
  return (
    <View style={props.separatorStyles}></View>
  )
}

const ListCP = forwardRef<KeyboardAwareFlatList, FlatListProps>(
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
      fakeEmpty,
      ...props
    } = flatListProps

    const variantStyles = useDefaultComponentStyle<'u:List', typeof ListPresets>('u:List', {
      variants,
      styles,
      transform: StyleSheet.flatten,

    })

    // const isEmpty = !props.data || !props.data.length
    const separator = props?.separators && <RenderSeparator separatorStyles={variantStyles.separator}/>

    const refreshStyles = StyleSheet.flatten([variantStyles.refreshControl, styles.refreshControl])

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

    return (
      <KeyboardAwareFlatList
        style={[
          variantStyles.wrapper,
          style,
          isEmpty && variantStyles['wrapper:empty'],
        ]}
        contentContainerStyle={[
          variantStyles.content,
          isEmpty && variantStyles['content:empty'],
        ]}
        // @ts-expect-error React's refs suck
        ItemSeparatorComponent={separator}
        ListHeaderComponentStyle={variantStyles.header}

        refreshControl={!!onRefresh && (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={refreshStyles?.color}
            colors={[refreshStyles?.color]}
            {...refreshControlProps}
          />
        )}

        ListEmptyComponent={<EmptyPlaceholder {...placeholder}/>}
        {...props}
        data={fakeEmpty ? [] : props.data}
        ref={ ref as React.LegacyRef<KeyboardAwareFlatList> }
        renderItem={renderItem}

      />
    )
  },
)

export type ListComponentType = <T extends any[] = any[]>(props: FlatListProps<T>) => React.ReactElement

export const List = ListCP as unknown as ListComponentType

