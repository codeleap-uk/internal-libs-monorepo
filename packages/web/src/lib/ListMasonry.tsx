import React from 'react'
import { useWindowSize } from '@react-hook/window-size'
import { TypeGuards } from '@codeleap/common'
import { EmptyPlaceholder } from '../components/EmptyPlaceholder'

import {
  useMasonry,
  usePositioner,
  useScroller,
  useContainerPosition,
  useResizeObserver,
  MasonryProps,
  RenderComponentProps,
} from 'masonic'

function fillItems(arr: Array<any>, toCount: number, fillContent = {}) {
  if (!arr || !TypeGuards.isArray(arr)) return []

  if (toCount === arr?.length) return arr

  const diff = toCount - arr?.length

  if (diff < 0) return arr

  const right = Array(diff).fill(fillContent)

  return arr.concat(right)
}

type UseMasonryReloadArgs = {
  data: Array<any>
  reloadTimeout: number
}

export const useMasonryReload = (args: UseMasonryReloadArgs) => {
  const {
    data,
    reloadTimeout = 350,
  } = args

  const [reloadingLayout, setReloadingLayout] = React.useState(false)
  const previousLengthRef = React.useRef(data?.length ?? 0)

  const updater = () => {
    previousLengthRef.current = (data?.length ?? 0)
  }

  React.useEffect(() => {
    if (previousLengthRef.current > data?.length) {
      setReloadingLayout(true)

      setTimeout(() => {
        updater()

        setTimeout(() => {
          setReloadingLayout(false)
        }, reloadTimeout)
      }, reloadTimeout)
    } else {
      updater()
    }
  }, [data?.length])

  return {
    reloadingLayout,
    setReloadingLayout,
    previousLength: previousLengthRef.current,
  }
}

export type ItemMasonryProps<T> = RenderComponentProps<T>

export type ListMasonryProps<T> = MasonryProps<T> & {
  previousItemsLength: number
  reloadingLayout: boolean
}

export function MasonryComponent<Item>(props: ListMasonryProps<Item>) {
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

  const positioner = usePositioner({ 
    width: listProps?.width, 
    columnGutter: listProps?.columnGutter, 
    columnWidth: listProps?.columnWidth,
    columnCount: listProps?.columnCount,
    maxColumnCount: listProps?.columnCount,
    rowGutter: listProps?.rowGutter
  })

  const { scrollTop, isScrolling } = useScroller(listProps?.offset, listProps?.scrollFps)

  const resizeObserver = useResizeObserver(positioner)

  return useMasonry({
    ...listProps,
    resizeObserver,
    positioner,
    scrollTop,
    isScrolling,
    items: fillItems(props?.items, props?.previousItemsLength)
  })
}

export function ListMasonry<Item>(props: ListMasonryProps<Item>) {
  if (props?.reloadingLayout) {
    return (
      <EmptyPlaceholder loading title={''} description={null} />
    )
  } else {
    return (
      <MasonryComponent 
        {...props}
        items={props?.items || []}
      />
    )
  }
}
