import React, { useCallback, useMemo } from 'react'
import { View } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { ListItem, ListProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { RenderComponentProps, useInfiniteLoader } from 'masonic'
import { TypeGuards } from '@codeleap/types'
import dynamic from 'next/dynamic'

export * from './styles'
export * from './types'

const Masonry = dynamic(
  () => import('masonic').then(mod => mod.Masonry),
  { ssr: false }
)

export function List<T extends ListItem>(props: ListProps<T>) {
  const {
    renderItem: providedRenderItem,
    ItemSeparatorComponent,
    data,
    fetchNextPage,
    style,
    hasNextPage,
    infiniteLoaderProps,
    separators,
    ListFooterComponent,
    placeholder,
    ...masonryProps
  } = {
    ...List.defaultProps,
    ...props,
  }

  const styles = useStylesFor(List.styleRegistryName, style)

  const maybeLoadMore = useInfiniteLoader(
    async (args) => {
      if (hasNextPage) fetchNextPage?.()
    },
    {
      isItemLoaded: (index, items) => !!items?.[index],
      ...infiniteLoaderProps,
    },
  )

  const separator = useMemo(() => {
    if (!separators) return null
    return ItemSeparatorComponent
  }, [])

  const renderItem = useCallback((itemMasonry: RenderComponentProps<T>) => {
    if (!providedRenderItem) return null

    const isFirst = itemMasonry?.index === 0

    return <>
      {isFirst ? null : separator}
      {providedRenderItem({ ...itemMasonry, item: itemMasonry?.data })}
    </>
  }, [providedRenderItem])

  const isEmpty = useMemo(() => data?.length <= 0 || !data?.length, [data?.length])

  return (
    <View style={styles.wrapper}>
      {isEmpty ? <EmptyPlaceholder {...placeholder} /> : null}

      <Masonry
        columnCount={1}
        overscanBy={7}
        {...masonryProps}
        items={data}
        css={styles.list as any}
        render={renderItem}
        onRender={maybeLoadMore}
      />

      {TypeGuards.isFunction(ListFooterComponent) ? <ListFooterComponent /> : ListFooterComponent}
    </View>
  )
}

List.styleRegistryName = 'List'
List.elements = ['wrapper', 'separator']
List.rootElement = 'wrapper'

List.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return List as <T extends ListItem>(props: StyledComponentProps<ListProps<T>, typeof styles>) => IJSX
}

List.defaultProps = {
  separators: true,
} as Partial<ListProps>

WebStyleRegistry.registerComponent(List)
