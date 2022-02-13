import * as React from 'react'
import { forwardRef, useState } from 'react'
import {
  deepEqual,
  onUpdate,
  useComponentStyle,
  usePrevious,
  useStyle,
} from '@codeleap/common'
import {
  KeyboardAwareFlatListProps,
  KeyboardAwareFlatList as KBDView,
} from 'react-native-keyboard-aware-scroll-view'
import { RefreshControl, FlatList } from 'react-native'
import { ViewProps } from './View'

export type FlatListProps = KeyboardAwareFlatListProps<any> &
  ViewProps & {
    onRefresh?: () => void;
    refreshTimeout?: number;
    changeData?: any;
  };

const KeyboardAwareFlatList =
  KBDView as unknown as React.ForwardRefExoticComponent<
    ViewProps & {
      refreshControl?: JSX.Element;
      ref?: FlatList;
    }
  >

export const List = forwardRef<FlatList, FlatListProps>(
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
    const { Theme } = useStyle()

    const variantStyles = useComponentStyle('View', {
      variants,
    })

    return (
      <KeyboardAwareFlatList
        style={[Theme.presets.full]}
        contentContainerStyle={[variantStyles.wrapper, style]}
        ref={ref as unknown as FlatList}
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
