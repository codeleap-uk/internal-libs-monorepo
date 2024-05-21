import React, { useCallback, forwardRef } from 'react'
import { ListRenderItemInfo } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { RefreshControl } from '../RefreshControl'
import { List } from '../List'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { GridProps } from './types'
import { AnyRecord, GenericStyledComponentAttributes, IJSX, StyledComponentProps, useStyleObserver, useTheme } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'

export * from './styles'
export * from './types'

const RenderSeparator = (props: { separatorStyles: ViewProps['style'] }) => {
  return <View style={props.separatorStyles} />
}

const defaultProps: Partial<GridProps> = {
  keyboardShouldPersistTaps: 'handled',
  refreshControlProps: {},
}

const GridCP = forwardRef<KeyboardAwareFlatList, GridProps>(
  (flatGridProps, ref) => {
    const {
      style,
      onRefresh,
      refreshing,
      placeholder,
      refreshControlProps = {},
      spacing,
      numColumns,
      ...props
    } = {
      ...Grid.defaultProps,
      ...flatGridProps,
    }

    // @ts-expect-error
    const themeSpacing = useTheme(store => store.current?.spacing)

    const styleObserver = useStyleObserver(style)

    const styles = React.useMemo(() => {
      return MobileStyleRegistry.current.styleFor(Grid.styleRegistryName, style)
    }, [styleObserver])

    const renderItem = useCallback((data: ListRenderItemInfo<any>) => {
      if (!props?.renderItem) return null
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
      const RenderItem = props?.renderItem

      return (
        <View style={[styles.itemWrapper, gap]}>
          <RenderItem {...data} {..._itemProps} />
        </View>
      )
    }, [props?.renderItem, props?.data?.length])

    const separatorStyles = { height: themeSpacing?.value?.(spacing), ...styles.separator }
    const separator = props?.separators || (!!spacing ? <RenderSeparator separatorStyles={separatorStyles} /> : null)
    const refreshControl = !!onRefresh && <RefreshControl refreshing={refreshing} onRefresh={onRefresh} {...refreshControlProps} />

    const _gridProps = {
      ...props,
      ref: ref,
      ListEmptyComponent: <EmptyPlaceholder {...placeholder} />,
      ListHeaderComponentStyle: styles.header,
      ListFooterComponentStyle: styles.footer,
      ItemSeparatorComponent: separator,
      refreshControl,
      style: styles.wrapper,
      contentContainerStyle: [styles.content, props?.contentContainerStyle],
      showsVerticalScrollIndicator: false,
      numColumns,
      renderItem,
    }

    return (
      // @ts-ignore
      <List
        {..._gridProps}
      />
    )
  },
)

export type GridComponentType =
  (<T extends any[] = any[]>(props: GridProps<T>) => JSX.Element) &
  GenericStyledComponentAttributes<AnyRecord> & { defaultProps?: Partial<GridProps> }

export const Grid = GridCP as unknown as GridComponentType

Grid.styleRegistryName = 'Grid'
Grid.elements = ['wrapper', 'content', 'separator', 'header', 'refreshControl', 'itemWrapper', 'footer']
Grid.rootElement = 'wrapper'

Grid.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Grid as (<T extends any[] = any[]>(props: StyledComponentProps<GridProps<T>, typeof styles>) => IJSX)
}

Grid.defaultProps = defaultProps

MobileStyleRegistry.registerComponent(Grid)
