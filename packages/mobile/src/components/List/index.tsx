import React, { forwardRef } from 'react'
import { useCallback, TypeGuards } from '@codeleap/common'
import { ListRenderItemInfo, FlatList } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { RefreshControl } from '../RefreshControl'
import { useKeyboardPaddingStyle } from '../../utils'
import { AnyRecord, GenericStyledComponentAttributes, IJSX, StyledComponentProps } from '@codeleap/styles'
import { FlatListProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'
export * from './PaginationIndicator'

const RenderSeparator = (props: { separatorStyles: ViewProps['style'] }) => {
  return <View style={props.separatorStyles} />
}

const ListCP = forwardRef<FlatList, FlatListProps>(
  (flatListProps, ref) => {
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
      ...props
    } = {
      ...List.defaultProps,
      ...flatListProps,
    }

    const styles = useStylesFor(List.styleRegistryName, style)

    const separator = props?.separators && <RenderSeparator separatorStyles={styles.separator} />

    const renderItem = useCallback((data: ListRenderItemInfo<any>) => {
      if (!props?.renderItem) return null
      const listLength = props?.data?.length || 0

      const isFirst = data.index === 0
      const isLast = data.index === listLength - 1

      const isOnly = isFirst && isLast

      return props?.renderItem({
        ...data,
        isFirst,
        isLast,
        isOnly,
      })
    }, [props?.renderItem, props?.data?.length])

    const isEmpty = !props.data || !props.data.length

    const _placeholder = {
      ...placeholder,
      loading: TypeGuards.isBoolean(placeholder?.loading) ? placeholder.loading : loading,
    }

    const keyboardStyle = useKeyboardPaddingStyle([
      styles.content,
      contentContainerStyle,
      isEmpty && styles['content:empty'],
    ], keyboardAware && !props.horizontal)

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
        {...props}
        ListHeaderComponentStyle={styles.header}
        style={[styles.wrapper, isEmpty && styles['wrapper:empty']]}
        contentContainerStyle={keyboardStyle}
        data={fakeEmpty ? [] : props.data}
        ref={ref}
        renderItem={renderItem}
      />
    )
  },
)

export type ListComponentType = (<T extends any[] = any[]>(props: FlatListProps<T>) => JSX.Element) & {
  defaultProps: Partial<FlatListProps>
} & GenericStyledComponentAttributes<AnyRecord>

export const List = ListCP as unknown as ListComponentType

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
