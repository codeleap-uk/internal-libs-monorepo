import * as React from 'react'
import { forwardRef, useState } from 'react'
import {
  deepEqual,
  onUpdate,
  useDefaultComponentStyle,
  usePrevious,
  useCodeleapContext,
  StylesOf,
  useCallback,
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

    const getItemPosition = (section, itemIdx) => {
      const listLength = section?.length || 0

      const isFirst = itemIdx === 0
      const isLast = itemIdx === listLength - 1
      const isOnly = isFirst && isLast

      return { isFirst, isLast, isOnly }
    }

    const getSectionPosition = (data) => {
      const listLength = props.sections?.length || 0

      const isFirst = data.section.key === props.sections[0].key
      const isLast = data.section.key === props.sections[listLength - 1].key
      const isOnly = isFirst && isLast

      return { isFirst, isLast, isOnly }
    }

    const renderSectionHeader = useCallback((data) => {
      if (!props?.renderSectionHeader) return null

      return props?.renderSectionHeader({ ...data, ...getSectionPosition(data) })
    }, [props?.renderSectionHeader, props?.data?.length])

    const renderSectionFooter = useCallback((data) => {
      if (!props?.renderSectionFooter) return null

      return props?.renderSectionFooter({ ...data, ...getSectionPosition(data) })
    }, [props?.renderSectionFooter, props?.data?.length])

    const renderItem = useCallback((data) => {
      if (!props?.renderItem) return null

      return props?.renderItem({ ...data, ...getItemPosition(data.section?.data, data?.index) })

    }, [props?.renderItem, props?.data?.length])

    const separatorProp = props.separators
    const isEmpty = !props.data || !props.data.length
    const separator = !isEmpty && separatorProp == true && renderSeparator

    return (
      <KeyboardAwareSectionList
        style={[Theme.presets.full, style, variantStyles.wrapper]}
        contentContainerStyle={[variantStyles.content]}
        showsVerticalScrollIndicator={false}
        // @ts-ignore
        ref={ref}
        ItemSeparatorComponent={separator}
        {...props}
        refreshControl={
          hasRefresh && (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          )
        }
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
      />
    )
  },
)
