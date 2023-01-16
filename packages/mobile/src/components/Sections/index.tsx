import * as React from 'react'
import { forwardRef, useState } from 'react'
import {
  deepEqual,
  onUpdate,
  useDefaultComponentStyle,
  usePrevious,
  useCodeleapContext,
} from '@codeleap/common'

import { RefreshControl, SectionList } from 'react-native'
import { View, ViewProps } from '../View'
import { KeyboardAwareScrollViewTypes } from '../../modules'
import { KeyboardAwareSectionList } from '../../utils'

export type SectionListProps = KeyboardAwareScrollViewTypes.KeyboardAwareSectionListProps<any> &
  ViewProps & {
    onRefresh?: () => void
    refreshTimeout?: number
    changeData?: any
    separators?: boolean
  }

export const Sections = forwardRef<SectionList, SectionListProps>(
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
      <KeyboardAwareSectionList
        style={[Theme.presets.full, style]}
        contentContainerStyle={[variantStyles.wrapper]}
        // @ts-ignore
        ref={ref}
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
