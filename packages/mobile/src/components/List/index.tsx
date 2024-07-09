import React, { forwardRef } from 'react'
import { useCallback, TypeGuards } from '@codeleap/common'
import { ListRenderItemInfo, FlatList } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { RefreshControl } from '../RefreshControl'
import { useKeyboardPaddingStyle } from '../../utils'
import { AnyRecord, GenericStyledComponentAttributes, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { FlatListProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'
export * from './PaginationIndicator'

const RenderSeparator = (props: { separatorStyles: ViewProps['style'] }) => {
  return <View style={props.separatorStyles} />
}

const ListCP = forwardRef<FlatList, FlatListProps>((flatListProps, ref) => {

  const {
    style,
    onRefresh,
    component,
    refreshing,
    placeholder,
    refreshControlProps,
    loading,
    keyboardAware,
    fakeEmpty = loading,
    contentContainerStyle,
    renderItem: RenderItem,
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
    if (!RenderItem) return null

    const isFirst = data.index === 0
    const isLast = data.index === dataLength - 1

    const isOnly = isFirst && isLast

    const itemProps = {
      ...data,
      isFirst,
      isLast,
      isOnly,
    }

    return <RenderItem {...itemProps} />
  }, [dataLength])

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
      style={wrapperStyle}
      contentContainerStyle={keyboardStyle}
      data={fakeEmpty ? [] : data}
      ref={ref}
      renderItem={renderItem}
    />
  )
},
)

export const List = ListCP as StyledComponentWithProps<FlatListProps>

List.styleRegistryName = 'List'
List.elements = ['wrapper', 'content', 'separator', 'header', 'refreshControl']
List.rootElement = 'wrapper'

List.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return List as (<T extends any[] = any[]>(props: StyledComponentProps<FlatListProps<T>, typeof styles>) => IJSX)
}

List.defaultProps = {
  keyboardShouldPersistTaps: 'handled',
  fakeEmpty: false,
  loading: false,
  keyboardAware: true,
}

MobileStyleRegistry.registerComponent(List)
