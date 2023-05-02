import * as React from 'react'
import { forwardRef, useState } from 'react'
import {
  deepEqual,
  onUpdate,
  useDefaultComponentStyle,
  usePrevious,
  useCodeleapContext,
  StylesOf,
} from '@codeleap/common'

import { RefreshControl, SectionList } from 'react-native'
import { View, ViewProps } from '../View'
import { KeyboardAwareScrollViewTypes } from '../../modules'
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view'
import { SectionsComposition, SectionsPresets } from './styles'
export * from './styles'

export type SectionListProps = KeyboardAwareScrollViewTypes.KeyboardAwareSectionListProps<any> &
  ViewProps & {
    onRefresh?: () => void
    refreshTimeout?: number
    changeData?: any
    separators?: boolean
    styles?: StylesOf<SectionsComposition>
  }

export const Sections = forwardRef<SectionList, SectionListProps>(
  (flatListProps, ref) => {
    const {
      variants = [],
      style,
      refreshTimeout = 3000,
      changeData,
      styles,
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

    const variantStyles = useDefaultComponentStyle<'u:Sections', typeof SectionsPresets>('u:Sections', {
      variants,
      styles,
    })

    const renderSeparator = () => {
      return (
        <View style={variantStyles.separator}></View>
      )
    }

    const separatorProp = props.separators
    const isEmpty = !props.data || !props.data.length
    const separator = !isEmpty && separatorProp == true && renderSeparator

    return (
      <KeyboardAwareSectionList
        style={[Theme.presets.full, style, variantStyles.wrapper]}
        contentContainerStyle={[variantStyles.content]}
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
