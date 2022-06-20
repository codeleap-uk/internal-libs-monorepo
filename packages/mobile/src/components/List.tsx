import * as React from 'react'
import { forwardRef, useState } from 'react'
import {
  deepEqual,
  onUpdate,
  useDefaultComponentStyle,
  usePrevious,
  useCodeleapContext,
  TypeGuards,
} from '@codeleap/common'
import {

  KeyboardAwareFlatList as KBDView,
  // @ts-ignore
} from 'react-native-keyboard-aware-scroll-view'

import { RefreshControl, FlatList, FlatListProps as RNFlatListProps, ListRenderItemInfo } from 'react-native'
import { View, ViewProps } from './View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from './EmptyPlaceholder'
import { ActivityIndicator } from './ActivityIndicator'
import { Text } from './Text'
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

export type FlatListProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> =RNFlatListProps<Data> &
  ViewProps & {
    refreshTimeout?: number
    changeData?: any
    separators?: boolean
    refreshing?: boolean
    placeholder?: EmptyPlaceholderProps
    keyboardAware?: boolean

  }

const KeyboardAwareFlatList =
  KBDView as unknown as React.ForwardRefExoticComponent<
    ViewProps & {
      refreshControl?: JSX.Element
      ref?: FlatList
    }
  >

const ListCP = forwardRef<FlatList, FlatListProps>(
  (flatListProps, ref) => {
    const {
      variants = [],
      style,
      refreshTimeout = 3000,
      changeData,
      placeholder,
      keyboardAware = true,
      ...props
    } = flatListProps
    const hasRefresh = !!props.onRefresh
    const [refreshingState, setRefreshing] = useState(false)
    const refreshingDisplay = props.refreshing !== undefined ? props.refreshing : refreshingState

    const timer = React.useRef(null)
    const previousData = usePrevious(changeData)

    const onRefresh = () => {
      if (timer.current) {
        clearTimeout(timer.current)
      }

      setRefreshing(true)

      props.onRefresh()

      timer.current = setTimeout(() => {
        setRefreshing(false)
      }, refreshTimeout)
    }
    onUpdate(() => {
      if (refreshingDisplay && !deepEqual(previousData, changeData)) {
        setRefreshing(false)
        if (timer.current) {
          clearTimeout(timer.current)
        }
      }
    }, [refreshingDisplay, changeData])
    const { Theme } = useCodeleapContext()

    const variantStyles = useDefaultComponentStyle('View', {
      variants,
    })

    const renderSeparator = () => {
      return (
        <View variants={['separator']}></View>
      )
    }

    const separatorProp = props.separators
    const isEmpty = !props.data || !props.data.length
    const separator = !isEmpty && separatorProp == true && renderSeparator

    const Component = keyboardAware ? KeyboardAwareFlatList : FlatList

    return (
      <Component
        style={[Theme.presets.full, style]}
        contentContainerStyle={[variantStyles.wrapper]}
        ref={ref as unknown as FlatList}
        ItemSeparatorComponent={separator}
        refreshControl={
          hasRefresh && (
            <RefreshControl refreshing={refreshingDisplay} onRefresh={onRefresh} />
          )
        }
        ListEmptyComponent={<EmptyPlaceholder {...placeholder}/>}
        {...props}
      />
    )
  },
)

export type PaginationIndicatorProps = {
  isFetching?: boolean
  hasMore?: boolean
  noMoreItemsText: React.ReactChild
  activityIndicator?: JSX.Element
}

export const PaginationIndicator = ({ hasMore, isFetching, noMoreItemsText, activityIndicator }: PaginationIndicatorProps) => {
  if (isFetching) {
    return activityIndicator || <ActivityIndicator variants={['center', 'marginVertical:3']}/>
  }
  if (!hasMore) {
    if (TypeGuards.isString(noMoreItemsText) || TypeGuards.isNumber(noMoreItemsText)) {
      return <Text variants={['h4', 'marginVertical:3', 'textCenter', 'fullWidth']} text={noMoreItemsText.toString()}/>
    }
    return noMoreItemsText
  }
  return null
}

export type ListComponentType = <T extends any[] = any[]>(props: FlatListProps<T>) => React.ReactElement

export const List = ListCP as ListComponentType

