import React from 'react'
import { useWindowSize } from '@react-hook/window-size'
import { arePropsEqual, usePrevious } from '@codeleap/common'

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

export function ListMasonry<Item>(props: MasonryProps<Item>) {
  const data = props?.items || []

  const dataPreviousLength = usePrevious(data?.length)

  const masonryUpdater = React.useMemo(() => {
    if (data?.length < dataPreviousLength) {
      return data?.length
    } else {
      return false
    }
  }, [dataPreviousLength, data?.length])

  const containerRef = React.useRef(null)

  const [windowWidth, height] = useWindowSize()

  const { offset, width } = useContainerPosition(containerRef, [
    windowWidth,
    height
  ])

  const { scrollTop, isScrolling } = useScroller(offset)

  const positioner = usePositioner(
    { width },
    [masonryUpdater]
  )

  const resizeObserver = useResizeObserver(positioner)

  return useMasonry({
    positioner,
    scrollTop,
    isScrolling,
    height,
    containerRef,
    resizeObserver,
    ...props,
    items: data,
  })
}
