import React, { forwardRef } from 'react'
import { TypeGuards } from '@codeleap/types'
import { useCallback } from '@codeleap/hooks'
import { ListRenderItemInfo, FlatList } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { RefreshControl } from '../RefreshControl'
import { useKeyboardPaddingStyle } from '../../utils'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { FlatListProps, ListItem } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

const RenderSeparator = (props: { separatorStyles: ViewProps['style'] }) => {
  return <View style={props.separatorStyles} />
}

export const List = forwardRef<FlatList, FlatListProps>((flatListProps, ref) => {
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
    renderItem: providedRenderItem,
    data,
    ...props
  } = {
    ...List.defaultProps,
    ...flatListProps,
  }

  const styles = useStylesFor(List.styleRegistryName, style)

  const separator = props?.separators && <RenderSeparator separatorStyles={styles.separator} />

  const dataLength = data?.length || 0

  const renderItem = useCallback((data: ListRenderItemInfo<any>) => {
    if (!providedRenderItem) return null

    const isFirst = data.index === 0
    const isLast = data.index === dataLength - 1

    const isOnly = isFirst && isLast

    const itemProps = {
      ...data,
      isFirst,
      isLast,
      isOnly,
    }

    return providedRenderItem(itemProps)
  }, [dataLength, providedRenderItem])

  const isEmpty = !data || !data?.length

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
    <FlatList
      ItemSeparatorComponent={separator as unknown as React.ComponentType}
      refreshControl={TypeGuards.isFunction(onRefresh) ? (
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          {...refreshControlProps}
        />
      ) : null}
      ListEmptyComponent={<EmptyPlaceholder {..._placeholder} />}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...props}
      ListHeaderComponentStyle={styles.header}
      style={wrapperStyle}
      contentContainerStyle={keyboardStyle}
      data={fakeEmpty ? [] : data}
      ref={ref}
      renderItem={renderItem}
    />
  )
}) as StyledComponentWithProps<FlatListProps>

List.styleRegistryName = 'List'
List.elements = ['wrapper', 'content', 'separator', 'header', 'refreshControl']
List.rootElement = 'wrapper'

List.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return List as <T extends ListItem>(props: StyledComponentProps<FlatListProps<T>, typeof styles>) => IJSX
}

List.defaultProps = {
  keyboardShouldPersistTaps: 'handled',
  fakeEmpty: false,
  loading: false,
  keyboardAware: true,
} as Partial<FlatListProps>

MobileStyleRegistry.registerComponent(List)
