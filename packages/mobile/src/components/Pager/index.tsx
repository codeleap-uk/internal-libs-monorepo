import {
  ComponentVariants,
  onUpdate,
  TypeGuards,
  useDefaultComponentStyle,
  useWarning,
} from '@codeleap/common'
import React, { ReactNode, useCallback, useRef } from 'react'
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
} from 'react-native'
import { StylesOf } from '../../types/utility'
import { ScrollProps } from '../Scroll'
import { View } from '../View'
import { PagerPresets, PagerComposition } from './styles'
export * from './styles'

export type PageProps = {
  isLast: boolean
  isFirst: boolean
  isActive: boolean
  isNext: boolean
  page: number
  index: number
  isPrevious: boolean
}

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>

export type PagerProps = React.PropsWithChildren<{
  variants?: ComponentVariants<typeof PagerPresets>['variants']
  styles?: StylesOf<PagerComposition>
  children?: (((pageData: PageProps) => ReactNode) | ReactNode)[]
  page?: number
  style?: any
  setPage?: (page: number) => void
  returnEarly?: boolean
  renderPageWrapper?: React.FC<PageProps>
  pageWrapperProps?: any
  width?: number
  onScroll?: ScrollProps['onScroll']
  /** If TRUE render page, nextPage and prevPage only */
  windowing?: boolean
  scrollRightEnabled?: boolean
  scrollLeftEnabled?: boolean
} & ScrollViewProps>

const defaultProps: Partial<PagerProps> = {
  variants: [],
  styles: {},
  page: 0,
  returnEarly: true,
  windowing: false,
  keyboardShouldPersistTaps: 'handled',
  scrollEnabled: true,
  scrollRightEnabled: false,
  scrollLeftEnabled: true
}

export const Pager = (pagerProps: PagerProps) => {
  const {
    styles,
    variants,
    width: widthProp,
    page,
    style = {},
    returnEarly = true,
    renderPageWrapper,
    pageWrapperProps = {},
    children,
    windowing = false,
    setPage,
    scrollEnabled = true,
    scrollLeftEnabled,
    scrollRightEnabled,
    onScroll,
  } = {
    ...defaultProps,
    ...pagerProps,
  }

  const childArr = React.Children.toArray(children)
  const scrollRef = useRef<ScrollView>(null)
  const [positionX, setPositionX] = React.useState(0)

  const [_scrollEnabled, setScrollEnabled] = React.useState(true)
  const scrollTimerRef = useRef(null)

  const variantStyles = useDefaultComponentStyle<'u:Pager', typeof PagerPresets>(
    'u:Pager',
    {
      styles,
      transform: StyleSheet.flatten,
      variants,
    },
  )

  const windowWidth = Dimensions.get('window').width
  let width = widthProp ?? variantStyles.wrapper.width

  const validWidth = TypeGuards.isNumber(width)

  if (!validWidth) {
    width = windowWidth
  }

  useWarning(
    !validWidth,
    'Pager',
    'provided width is not a number, using default width',
  )

  const nChildren = React.Children.count(children)

  const lastPage = nChildren - 1

  const WrapperComponent = renderPageWrapper || View

  const hasScrollDirectionDisabled = !scrollLeftEnabled || !scrollRightEnabled

  const scrollEnabledTimer = () => {
    if (scrollTimerRef.current === null) {
      scrollTimerRef.current = setTimeout(() => {
        scrollRef.current.scrollTo({
          x: positionX,
          animated: true,
        })

        setScrollEnabled(true)

        clearTimeout(scrollTimerRef.current)
        scrollTimerRef.current = null
      }, 250)
    }
  }

  const handleScrollEnd = useCallback(
    ({ nativeEvent }: ScrollEvent) => {
      const x = nativeEvent.contentOffset.x
      const toPage = Math.ceil(x / width)

      if (toPage !== page && toPage <= childArr.length - 1) {
        setPage(toPage)
        setPositionX(toPage * width)
      }
    },
    [childArr, page, setPage],
  )

  const handleScroll = useCallback((event: ScrollEvent) => {
    if (TypeGuards.isFunction(onScroll)) onScroll?.(event)

    if (!hasScrollDirectionDisabled) return null
    
    const scrollX = event?.nativeEvent?.contentOffset?.x

    const isRight = scrollX < positionX
    const isLeft = scrollX > positionX

    console.log({
      isLeft,
      isRight,
      scrollX,
      positionX,
    })

    if (isRight && !scrollRightEnabled || isLeft && !scrollLeftEnabled) {
      setScrollEnabled(false)
      scrollEnabledTimer()
    }
  }, [])

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
      scrollEventThrottle={hasScrollDirectionDisabled ? 0 : 300}
      showsHorizontalScrollIndicator={false}
      style={[variantStyles.wrapper, style]}
      {...pagerProps}
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
          style: [{ height: '100%', width }, variantStyles.page],
          ...pageWrapperProps,
        }

        return <WrapperComponent {...wrapperProps}>{content}</WrapperComponent>
      })}
    </ScrollView>
  )
}

Pager.defaultProps = defaultProps
