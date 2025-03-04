import React, { useMemo } from 'react'
import { TypeGuards } from '@codeleap/types'
import { useCallback } from '@codeleap/hooks'
import { SectionList, SectionListProps as RNSectionProps } from 'react-native'
import { View, ViewProps } from '../View'
import { RefreshControl } from '../RefreshControl'
import { useKeyboardPaddingStyle } from '../../utils'
import { AugmentedSectionRenderItemInfo, SectionComponentProps, SectionProps, SectionRenderComponentProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { EmptyPlaceholder } from '../EmptyPlaceholder'

export * from './styles'
export * from './types'

const RenderSeparator = (props: { separatorStyles: ViewProps['style'] }) => {
  return <View style={props.separatorStyles} />
}

export function Sections<T>(sectionsProps: SectionProps<T>) {
  const {
    style,
    onRefresh,
    refreshing,
    placeholder,
    refreshControlProps,
    loading,
    keyboardAware,
    fakeEmpty = loading,
    contentContainerStyle,
    refreshControl,
    renderItem: RenderItem,
    sections: data,
    renderSectionHeader: RenderSectionHeader,
    renderSectionFooter: RenderSectionFooter,
    ...props
  } = {
    ...Sections.defaultProps,
    ...sectionsProps,
  }

  const sections = useMemo(() => {
    return data?.map((section, index) => ({
      ...section,
      index,
    }))
  }, [JSON.stringify(data)])

  const styles = useStylesFor(Sections.styleRegistryName, style)

  const separator = useCallback(() => {
    if (!props?.separators) return null
    return <RenderSeparator separatorStyles={styles.separator} />
  }, [])

  const getSectionProps = (data: SectionRenderComponentProps<T>) => {
    const listLength = sections?.length || 0

    const isFirst = data?.section?.index === sections?.[0]?.index
    const isLast = data?.section?.index === sections?.[listLength - 1]?.index
    const isOnly = isFirst && isLast
    const title = data?.section?.title
    const index = data?.section?.index

    return { isFirst, isLast, isOnly, title, index }
  }

  const renderSectionHeader = useCallback((data: SectionRenderComponentProps<T>) => {
    if (!RenderSectionHeader) return null

    const positionProps = getSectionProps(data)

    return <RenderSectionHeader {...data.section} {...positionProps} />
  }, [RenderSectionHeader, sections?.length])

  const renderSectionFooter = useCallback((data: SectionRenderComponentProps<T>) => {
    if (!RenderSectionFooter) return null

    const positionProps = getSectionProps(data)

    return <RenderSectionFooter {...data.section} {...positionProps} />
  }, [RenderSectionFooter, sections?.length])

  const renderItem = useCallback((data: AugmentedSectionRenderItemInfo<T>) => {
    if (!RenderItem) return null

    const listLength = data?.section?.data?.length || 0

    const isFirst = data?.index === 0
    const isLast = data?.index === listLength - 1
    const isOnly = isFirst && isLast

    return (
      <RenderItem
        {...data}
        isFirst={isFirst}
        isLast={isLast}
        isOnly={isOnly}
      />
    )
  }, [RenderItem])

  const isEmpty = !sections || !sections?.length

  const _placeholder = {
    ...placeholder,
    loading: TypeGuards.isBoolean(placeholder?.loading) ? placeholder.loading : loading,
  }

  const keyboardStyle = useKeyboardPaddingStyle([
    styles.content,
    contentContainerStyle,
    isEmpty && styles['content:empty'],
    loading && styles['content:loading'],
  ], keyboardAware && !props.horizontal)

  const wrapperStyle = [styles.wrapper, isEmpty && styles['wrapper:empty'], loading && styles['wrapper:loading']]

  return (
    <SectionList
      ItemSeparatorComponent={separator}
      refreshControl={!!onRefresh && (
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          {...refreshControlProps}
        />
      )}
      ListEmptyComponent={<EmptyPlaceholder {..._placeholder} />}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...props}
      ListHeaderComponentStyle={styles.header}
      ListFooterComponentStyle={styles.footer}
      style={wrapperStyle}
      contentContainerStyle={keyboardStyle}
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader as unknown as RNSectionProps<T>['renderSectionHeader']}
      renderSectionFooter={renderSectionFooter as unknown as RNSectionProps<T>['renderSectionHeader']}
    />
  )
}

Sections.styleRegistryName = 'Sections'
Sections.elements = ['wrapper', 'content', 'separator', 'header', 'footer', 'refreshControl']
Sections.rootElement = 'wrapper'

Sections.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Sections as <T>(props: StyledComponentProps<SectionProps<T>, typeof styles>) => IJSX
}

Sections.defaultProps = {
  keyboardShouldPersistTaps: 'handled',
  fakeEmpty: false,
  loading: false,
  keyboardAware: true,
} as Partial<SectionProps>

MobileStyleRegistry.registerComponent(Sections)
