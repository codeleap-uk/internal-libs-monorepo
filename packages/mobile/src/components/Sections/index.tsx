import React, { forwardRef } from 'react'
import { useCallback } from '@codeleap/common'
import { RefreshControl, SectionList } from 'react-native'
import { View } from '../View'
import { useKeyboardPaddingStyle } from '../../utils'
import { SectionListProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const Sections = forwardRef<SectionList, SectionListProps>((sectionsProps, ref) => {

  const {
    style,
    onRefresh,
    component,
    refreshing,
    placeholder,
    keyboardAware,
    refreshControlProps,
    contentContainerStyle,
    fakeEmpty,
    refreshControl,
    ...props
  } = {
    ...Sections.defaultProps,
    ...sectionsProps,
  }

  const styles = useStylesFor(Sections.styleRegistryName, style)

  const renderSeparator = useCallback(() => {
    return <View style={styles?.separator} />
  }, [styles?.separator])

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

  const keyboardStyle = useKeyboardPaddingStyle([styles?.content, contentContainerStyle], keyboardAware)

  return (
    <SectionList
      style={styles?.wrapper}
      contentContainerStyle={keyboardStyle}
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
) as StyledComponentWithProps<SectionListProps>

Sections.styleRegistryName = 'Sections'
Sections.elements = ['wrapper', 'content', 'separator']
Sections.rootElement = 'wrapper'

Sections.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Sections as (props: StyledComponentProps<SectionListProps, typeof styles>) => IJSX
}

Sections.defaultProps = {
  keyboardShouldPersistTaps: 'handled',
  keyboardAware: true,
}

MobileStyleRegistry.registerComponent(Sections)
