import * as React from 'react'
import { forwardRef, useState } from 'react'
import {
  deepEqual,
  onUpdate,
  useDefaultComponentStyle,
  usePrevious,
  useCodeleapContext,
} from '@codeleap/common'
import {

  KeyboardAwareFlatList as KBDView,
  // @ts-ignore
} from 'react-native-keyboard-aware-scroll-view'

import { RefreshControl, FlatList } from 'react-native'
import { View, ViewProps } from './View'

type RNFlatListProps<T = any> = FlatList<T>['props']
export type FlatListProps<T = any> = RNFlatListProps<T> &
  ViewProps & {
    onRefresh?: () => void
    refreshTimeout?: number
    changeData?: any
    separators?: boolean
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
      ...props
    } = flatListProps
    const hasRefresh = !!props.onRefresh
    const [refreshing, setRefreshing] = useState(false)

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
      if (refreshing && !deepEqual(previousData, changeData)) {
        setRefreshing(false)
        if (timer.current) {
          clearTimeout(timer.current)
        }
      }
    }, [refreshing, changeData])
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

    return (
      <KeyboardAwareFlatList
        style={[Theme.presets.full, style]}
        contentContainerStyle={[variantStyles.wrapper]}
        ref={ref as unknown as FlatList}
        ItemSeparatorComponent={separator}
        {...props}
        refreshControl={
          hasRefresh && (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          )
        }
      />
    )
  },
)

export const List = ListCP as (<T = any>(props: FlatListProps<T>) => JSX.Element)
