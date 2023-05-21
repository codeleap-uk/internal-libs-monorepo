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
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { SectionsComposition, SectionsPresets } from './styles'
import { StylesOf } from '../../types'
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view'

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

const RenderSeparator = (props: { separatorStyles: ViewProps['style'] }) => {
    return (
      <View style={props.separatorStyles}></View>
    )
}

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
      ...props
    } = sectionsProps

    const variantStyles = useDefaultComponentStyle<'u:Sections', typeof SectionsPresets>('u:Sections', {
      variants,
      styles,
      transform: StyleSheet.flatten,

    })

    // const isEmpty = !props.data || !props.data.length
    const separator = props?.separators && (() => <RenderSeparator separatorStyles={variantStyles.separator}/>)


    const refreshStyles = StyleSheet.flatten([variantStyles.refreshControl, styles.refreshControl])

    const flatSectionsData = props?.sections?.flatMap(x => x.data) || []



    const renderItem = useCallback((data: SectionListRenderItemInfo<any>) => {
      if (!props?.renderItem) return null
      
      const listLength = data.section?.data?.length || 0

      const isFirst = data.index === 0
      const isLast = data.index === listLength - 1

      const isOnly = isFirst && isLast

      return props?.renderItem({
        ...data,
        isFirst,
        isLast,
        isOnly,
      })
    }, [props?.renderItem, props?.sections?.length])

    const isEmpty = !props.sections || !props.sections.length || props.sections.some(x => {
      return !x.data || !x.data.length
    })

    return (
      <KeyboardAwareSectionList
       style={[
          variantStyles.wrapper, 
          style,
          isEmpty && variantStyles['wrapper:empty']
        ]}
        contentContainerStyle={[
          variantStyles.content,
          isEmpty && variantStyles['content:empty']
        ]}
        
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
        data={fakeEmpty ? [] : props.sections}

        // @ts-ignore
        ref={ ref as React.LegacyRef<KeyboardAwareSectionList> }
        renderItem={renderItem}
        
      />
    )
  },
)
