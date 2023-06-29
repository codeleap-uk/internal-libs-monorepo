import * as React from 'react'
import { forwardRef } from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  useCallback,
} from '@codeleap/common'

import {
  RefreshControl,
  StyleSheet,
  RefreshControlProps,
  SectionListRenderItemInfo,
  SectionListProps as RNSectionListProps,
} from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { StylesOf } from '../../types'
import { KeyboardAwareSectionList, KeyboardAwareSectionListProps } from 'react-native-keyboard-aware-scroll-view'
import { SectionsComposition, SectionsPresets } from './styles'
export * from './styles'

export type DataboundSectionListPropsTypes = 'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'

export type AugmentedSectionRenderItemInfo<T> = SectionListRenderItemInfo<T> & {
  isFirst: boolean
  isLast: boolean
  isOnly: boolean
}

export type ReplaceSectionListProps<P, T> = Omit<P, DataboundSectionListPropsTypes> & {
  sections: T[]
  keyExtractor?: (item: T, index: number) => string
  renderItem: (data: AugmentedSectionRenderItemInfo<T>) => React.ReactElement
  onRefresh?: () => void
  getItemLayout?: ((
    data:T,
    index: number,
  ) => { length: number; offset: number; index: number })
  fakeEmpty?: boolean
}

export * from './styles'

export type SectionListProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> = ReplaceSectionListProps<RNSectionListProps<Data>, Data> &
  Omit<ViewProps, 'variants'> & {
    separators?: boolean
    placeholder?: EmptyPlaceholderProps
    styles?: StylesOf<SectionsComposition>
    refreshControlProps?: Partial<RefreshControlProps>
    fakeEmpty?: boolean
  } & ComponentVariants<typeof SectionsPresets>

export const Sections = forwardRef<KeyboardAwareSectionList, SectionListProps>(
  (sectionsProps, ref) => {
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
      refreshControl,
      ...props
    } = sectionsProps

    const variantStyles = useDefaultComponentStyle<'u:Sections', typeof SectionsPresets>('u:Sections', {
      variants,
      styles,
      transform: StyleSheet.flatten,

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
    }, [props?.renderSectionHeader, props?.sections?.length])

    const renderSectionFooter = useCallback((data) => {
      if (!props?.renderSectionFooter) return null

      return props?.renderSectionFooter({ ...data, ...getSectionPosition(data) })
    }, [props?.renderSectionFooter, props?.sections?.length])

    const renderItem = useCallback((data) => {
      if (!props?.renderItem) return null

      return props?.renderItem({ ...data, ...getItemPosition(data.section?.data, data?.index) })

    }, [props?.renderItem, props?.sections?.length])

    const separatorProp = props.separators
    const isEmpty = !props.sections || !props.sections.length
    const separator = !isEmpty && separatorProp == true && renderSeparator

    return (
      <KeyboardAwareSectionList
        style={[variantStyles.wrapper, style]}
        contentContainerStyle={[variantStyles.content]}
        showsVerticalScrollIndicator={false}
        // @ts-ignore
        ref={ref}
        ItemSeparatorComponent={separator}
        {...props}
        refreshControl={
          !!onRefresh && (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          )
        }
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
      />
    )
  },
) as unknown as <T = any>(props: SectionListProps<T>) => JSX.Element
