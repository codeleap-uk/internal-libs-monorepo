import React, { useCallback, forwardRef, ComponentType } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { RefreshControl } from '../RefreshControl'
import { List, ListItem } from '../List'
import { GridProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps, useTheme } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { TypeGuards } from '@codeleap/types'

export * from './styles'
export * from './types'

const RenderSeparator = (props: { separatorStyles: ViewProps['style'] }) => {
  return <View style={props.separatorStyles} />
}

export const Grid = forwardRef<FlatList, GridProps>((flatGridProps, ref) => {
  const {
    style,
    onRefresh,
    refreshing,
    placeholder,
    refreshControlProps = {},
    spacing,
    numColumns,
    renderItem: RenderItem,
    ...props
  } = {
    ...Grid.defaultProps,
    ...flatGridProps,
  }

  const themeSpacing = useTheme(store => store.theme?.spacing)

  const styles = useStylesFor(Grid.styleRegistryName, style)

  const renderItem = useCallback((data: ListRenderItemInfo<any>) => {
    if (!RenderItem) return null

    const listLength = props?.data?.length || 0

    const isFirst = data.index === 0
    const isLast = data.index === listLength - 1
    const isOnly = isFirst && isLast

    const idx = data.index + 1
    const isLastInRow = !isFirst && idx % (numColumns) === 0
    const isFirstInRow = isFirst || data.index % numColumns === 0
    const isOnlyInRow = !isFirstInRow && !isLastInRow

    let gap = themeSpacing?.marginRight?.(spacing / 2)
    if (isLastInRow) gap = themeSpacing?.marginLeft?.(spacing / 2)
    else if (isOnlyInRow) gap = themeSpacing?.marginHorizontal?.(spacing / 2)

    const _itemProps = { isFirst, isLast, isOnly, isFirstInRow, isLastInRow, isOnlyInRow }

    return (
      <View style={[styles.itemWrapper, gap]}>
        <RenderItem {...data} {..._itemProps} />
      </View>
    )
  }, [RenderItem, props?.data?.length])

  const separatorStyles = { height: themeSpacing?.value?.(spacing), ...styles.separator }
  const separator = props?.separators || (!!spacing ? <RenderSeparator separatorStyles={separatorStyles} /> : null)
  const refreshControl = TypeGuards.isFunction(onRefresh) ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} {...refreshControlProps} /> : null

  return (
    <List
      // @ts-expect-error
      ref={ref}
      {...props}
      ListEmptyComponent={<EmptyPlaceholder {...placeholder} />}
      ListHeaderComponentStyle={styles.header}
      ListFooterComponentStyle={styles.footer}
      ItemSeparatorComponent={separator as unknown as ComponentType}
      refreshControl={refreshControl}
      style={styles.wrapper}
      contentContainerStyle={[styles.content, props?.contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      numColumns={numColumns}
      renderItem={renderItem}
    />
  )
}) as StyledComponentWithProps<GridProps>

Grid.styleRegistryName = 'Grid'
Grid.elements = ['wrapper', 'content', 'separator', 'header', 'refreshControl', 'itemWrapper', 'footer']
Grid.rootElement = 'wrapper'

Grid.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Grid as (<T extends ListItem>(props: StyledComponentProps<GridProps<T>, typeof styles>) => IJSX)
}

Grid.defaultProps = {
  keyboardShouldPersistTaps: 'handled',
  refreshControlProps: {},
} as Partial<GridProps>

MobileStyleRegistry.registerComponent(Grid)
