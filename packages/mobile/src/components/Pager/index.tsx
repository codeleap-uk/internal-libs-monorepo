import React, { useCallback, useRef } from 'react'
import { onUpdate, TypeGuards } from '@codeleap/common'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { Dimensions, ScrollView } from 'react-native'
import { MobileStyleRegistry } from '../../Registry'
import { View } from '../View'
import { PageProps, PagerProps, ScrollEvent } from './types'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const Pager = (pagerProps: PagerProps) => {
  const {
    width: widthProp,
    page,
    style,
    returnEarly,
    renderPageWrapper,
    pageWrapperProps = {},
    children,
    windowing,
    setPage,
    scrollEnabled,
    scrollLeftEnabled,
    scrollRightEnabled,
    onScroll,
    scrollDirectionThrottle,
    onSwipeLastPage,
    waitEventDispatchTimeout,
  } = {
    ...Pager.defaultProps,
    ...pagerProps,
  }

  const childArr = React.Children.toArray(children)
  const scrollRef = useRef<ScrollView>(null)
  const [positionX, setPositionX] = React.useState(0)
  const [scrollPositionX, setScrollPositionX] = React.useState(0)
  const [_scrollEnabled, setScrollEnabled] = React.useState(true)
  const waitEventDispatch = useRef(false)

  const styles = useStylesFor(Pager.styleRegistryName, style)

  const windowWidth = Dimensions.get('window').width

  // @ts-expect-error
  let width = widthProp ?? styles?.wrapper?.width

  const validWidth = TypeGuards.isNumber(width)

  if (!validWidth) {
    width = windowWidth
  }

  const nChildren = React.Children.count(children)

  const lastPage = nChildren - 1

  const WrapperComponent = renderPageWrapper || View

  const hasScrollDirectionDisabled = !scrollLeftEnabled || !scrollRightEnabled

  const handleScrollEnd = useCallback((event: ScrollEvent) => {
    if (!scrollEnabled) return null

    if (waitEventDispatch.current === true) return null

    waitEventDispatch.current = true

    const x = event?.nativeEvent.contentOffset.x
    const toPage = Math.floor(((Math.round(x)) / Math.round(width)))

    const length = childArr.length - 1

    if (toPage >= length && TypeGuards.isFunction(onSwipeLastPage) && page >= length) {
      onSwipeLastPage?.(event)
    } else if (toPage !== page && toPage <= length) {
      setPage(toPage)
      setPositionX(toPage * width)
    }

    setTimeout(() => {
      waitEventDispatch.current = false
    }, waitEventDispatchTimeout)
  }, [childArr, page, setPage, waitEventDispatch.current])

  const handleScroll = (event: ScrollEvent) => {
    const scrollX = event?.nativeEvent?.contentOffset?.x

    if (!scrollEnabled) {
      if (TypeGuards.isFunction(onScroll)) onScroll?.(event, { x: scrollX })
      return null
    }

    if (!_scrollEnabled) {
      setScrollPositionX(scrollX)
      return null
    }

    const isRight = scrollX < scrollPositionX
    const isLeft = scrollX > scrollPositionX

    if (TypeGuards.isFunction(onScroll)) onScroll?.(event, { isLeft, isRight, x: scrollX })

    if (hasScrollDirectionDisabled) {
      if (isRight && !scrollRightEnabled || isLeft && !scrollLeftEnabled) {
        setScrollEnabled(false)

        setTimeout(() => {
          scrollRef.current.scrollTo({
            x: positionX,
            animated: true,
          })

          setTimeout(() => {
            setScrollEnabled(true)
          }, scrollDirectionThrottle)
        })
      }
    }

    setScrollPositionX(scrollX)
  }

  onUpdate(() => {
    const x = width * page
    if (scrollRef.current && x !== positionX) {
      scrollRef.current.scrollTo({
        x,
        animated: true,
      })
      setPositionX(x)
    }
  }, [page])

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      onMomentumScrollEnd={handleScrollEnd}
      scrollEventThrottle={hasScrollDirectionDisabled ? 2000 : 300}
      showsHorizontalScrollIndicator={false}
      {...pagerProps}
      style={styles?.wrapper}
      onScroll={handleScroll}
      scrollEnabled={childArr.length > 1 && scrollEnabled && _scrollEnabled}
    >
      {childArr.map((child: PagerProps['children'][number], index) => {
        const isActive = index === page
        const isLast = index === lastPage
        const isFirst = index === 0
        const isNext = index === page + 1
        const isPrevious = index === page - 1

        const shouldRender = windowing ? (isActive || isNext || isPrevious) : true

        if (!shouldRender && returnEarly) {
          return <View style={{ height: '100%', width }} />
        }

        const pageProps: PageProps = {
          isLast,
          isActive,
          isFirst,
          isNext,
          isPrevious,
          index,
          page,
        }

        const content = typeof child === 'function' ? child(pageProps) : child

        const wrapperProps = {
          key: index,
          ...pageWrapperProps,
          style: [{ height: '100%', width }, styles?.page],
        }

        return <WrapperComponent {...wrapperProps}>{content}</WrapperComponent>
      })}
    </ScrollView>
  )
}

Pager.styleRegistryName = 'Pager'
Pager.elements = ['page', 'wrapper']
Pager.rootElement = 'wrapper'

Pager.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Pager as (props: StyledComponentProps<PagerProps, typeof styles>) => IJSX
}

Pager.defaultProps = {
  page: 0,
  returnEarly: true,
  windowing: false,
  keyboardShouldPersistTaps: 'handled',
  scrollEnabled: true,
  scrollRightEnabled: true,
  scrollLeftEnabled: true,
  scrollDirectionThrottle: 650,
  waitEventDispatchTimeout: 250,
} as Partial<PagerProps>

MobileStyleRegistry.registerComponent(Pager)
