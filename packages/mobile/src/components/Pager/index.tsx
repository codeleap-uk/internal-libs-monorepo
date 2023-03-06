import {
  ComponentVariants,
  onUpdate,
  useDefaultComponentStyle,
} from '@codeleap/common'
import React, { ReactNode, useCallback, useRef } from 'react'
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { StylesOf } from '../../types/utility'
import { ScrollProps } from '../Scroll'
import { View } from '../View'
import { PagerStyles, PagerComposition } from './styles'
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

export type PagerProps = {
  variants?: ComponentVariants<typeof PagerStyles>['variants']
  styles?: StylesOf<PagerComposition>
  children?: (((pageData: PageProps) => ReactNode) | ReactNode)[]
  page?: number
  style?: any
  setPage?: (page: number) => void
  returnEarly?: boolean
  renderPageWrapper?: React.FC<PageProps>
  pageWrapperProps?: any
  width?: number
  onScroll: ScrollProps['onScroll']
}

export const Pager: React.FC<PagerProps> = (pagerProps) => {
  const {
    styles,
    variants,
    width = Dimensions.get('screen').width,
    page,
    style = {},
    returnEarly = true,
    renderPageWrapper,
    pageWrapperProps = {},
    children,
    setPage,
  } = pagerProps
  const childArr = React.Children.toArray(children)
  const scrollRef = useRef<ScrollView>(null)
  const [positionX, setPositionX] = React.useState(0)

  let variantStyles = useDefaultComponentStyle<'u:Pager', typeof PagerStyles>(
    'u:Pager',
    {
      styles,
      transform: StyleSheet.flatten,
      variants,
    },
  )
  const nChildren = React.Children.count(children)

  const lastPage = nChildren - 1

  const WrapperComponent = renderPageWrapper || View

  // Reamimated seems to glitch if this is not done
  variantStyles = JSON.parse(JSON.stringify(variantStyles))

  const handleScrollEnd = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = nativeEvent.contentOffset.x
      const toPage = Math.ceil(x / width)

      if (toPage !== page && toPage <= childArr.length - 1) {
        setPage(toPage)
        setPositionX(toPage * width)
      }
    },
    [childArr, page, setPage],
  )

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
      {...pagerProps}
      ref={scrollRef}
      horizontal
      pagingEnabled
      onMomentumScrollEnd={handleScrollEnd}
      scrollEventThrottle={300}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={childArr.length > 1}
      style={[variantStyles.wrapper, style]}
    >
      {childArr.map((child: PagerProps['children'][number], index) => {
        const isActive = index === page
        const isLast = index === lastPage
        const isFirst = index === 0
        const isNext = index === page + 1
        const isPrevious = index === page - 1
        const shouldRender = isActive || isNext || isPrevious
        if (!shouldRender && returnEarly) {
          return <View style={{ height: '100%', width }} />
        }
        let pos = 0

        if (isActive) {
          pos = 1
        } else if (index > page) {
          pos = 2
        } else {
          pos = 0
        }

        const pageProps = {
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
          style: { height: '100%', width },
          ...pageWrapperProps,
        }

        return <WrapperComponent {...wrapperProps}>{content}</WrapperComponent>
      })}
    </ScrollView>
  )
}
