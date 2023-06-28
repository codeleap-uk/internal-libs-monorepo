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
  onScroll: ScrollProps['onScroll']
   /** If TRUE render page, nextPage and prevPage only */
   windowing?:boolean
}>

export const Pager = (pagerProps:PagerProps) => {
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
  } = pagerProps

  const childArr = React.Children.toArray(children)
  const scrollRef = useRef<ScrollView>(null)
  const [positionX, setPositionX] = React.useState(0)

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

        const shouldRender = windowing ? (isActive || isNext || isPrevious) : true

        if (!shouldRender && returnEarly) {
          return <View style={{ height: '100%', width }} />
        }

        const pageProps:PageProps = {
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
