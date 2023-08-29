import React from 'react'
import { useWindowSize } from '@react-hook/window-size'
import { AnyFunction, onUpdate, TypeGuards, usePrevious } from '@codeleap/common'

import {
  useMasonry,
  usePositioner,
  useScroller,
  useContainerPosition,
  useResizeObserver,
  MasonryProps,
  RenderComponentProps,
} from 'masonic'

export type ItemMasonryProps<T> = RenderComponentProps<T>

export function ListMasonry<Item>(props: MasonryProps<Item> & { onRefreshItems: AnyFunction }) {
  const data = props?.items || []

  const dataPreviousLength = usePrevious(data?.length)

  const masonryUpdater = React.useMemo(() => {
    if (data?.length < dataPreviousLength) {
      return data?.length
    } else {
      return false
    }
  }, [dataPreviousLength, data?.length])

  onUpdate(() => {
    if (!!masonryUpdater) {
      props?.onRefreshItems?.(() => null)
    }
  }, [masonryUpdater])

  const containerRef = React.useRef(null)

  const windowSize = useWindowSize({
    initialWidth: props?.ssrWidth,
    initialHeight: props?.ssrHeight,
  })

  const containerPosition = useContainerPosition(containerRef, windowSize)

  const listProps = Object.assign(
    {
      offset: containerPosition?.offset,
      width: containerPosition?.width || containerRef?.current?.clientWidth || windowSize?.[0],
      height: windowSize?.[1],
      containerRef,
      scrollFps: props?.scrollFps || 12,
    },
    props
  ) as any

  listProps.positioner = usePositioner({ 
    width: listProps?.width, 
    columnGutter: listProps?.columnGutter, 
    columnWidth: listProps?.columnWidth,
    columnCount: listProps?.columnCount,
    maxColumnCount: listProps?.columnCount,
    rowGutter: listProps?.rowGutter
  }, [masonryUpdater])

  const { scrollTop, isScrolling } = useScroller(listProps?.offset, listProps?.scrollFps)

  listProps.resizeObserver = useResizeObserver(listProps.positioner)

  return useMasonry({
    ...listProps,
    scrollTop,
    isScrolling,
    items: data,
  })
}
