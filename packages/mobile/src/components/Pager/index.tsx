import {
  ComponentVariants,
  onUpdate,
  useDefaultComponentStyle,
  useDebounce,
  useCodeleapContext,
} from '@codeleap/common'
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types/utility'
import { Animated } from '../Animated'
import { Button } from '../Button'
import { View } from '../View'
import { Text } from '../Text'
import { MobilePagerStyles, PagerComposition } from './styles'

export * from './styles'

export type PagerProps = {
  variants?: ComponentVariants<typeof MobilePagerStyles>['variants']
  styles?: StylesOf<PagerComposition>
  page?: number
  loop?: boolean
  debug?: boolean
  onPageChange?: (page: number) => void
}

export type PagerRef = {
  forward(by?: number): void
  back(by?: number): void
  to(index?: number): void
}

export const Pager = forwardRef<PagerRef, PagerProps>((pagerProps, ref) => {
  const {
    children,
    styles,
    variants,
    page: propPage,
    debug,
    loop,
    onPageChange,
  } = pagerProps

  const [page, setPage] = useState(() => propPage ?? 0)

  const variantStyles = useDefaultComponentStyle<'u:Pager', typeof MobilePagerStyles>(
    'u:Pager',
    {
      styles,
      transform: StyleSheet.flatten,
      variants,
    },
  )
  const { logger } = useCodeleapContext()
  const nChildren = React.Children.count(children)

  const lastPage = nChildren - 1

  const pagerRef = useRef<PagerRef>({
    forward: (by = 1) => {
      setPage((currentPage) => {
        if (currentPage < lastPage) {
          return currentPage + by
        } else if (loop) {
          return by - 1
        }
        return currentPage
      })
    },
    back: (by = 1) => {
      setPage((currentPage) => {
        if (currentPage > 0) {
          return currentPage - by
        } else if (loop) {
          return nChildren - by
        }
        return currentPage
      })
    },
    to: (n: number) => {
      if (n >= 0 && n <= lastPage) {
        setPage(n)
      } else {
        logger.warn(
          'Attempted to go to a page which falls outside range',
          { currentPage: page, attemptedToGoTo: n, pageRange: [0, lastPage] },
          'Component',
        )
      }
    },
  })

  onUpdate(() => {
    onPageChange?.(page)
  }, [page])

  onUpdate(() => {
    if (typeof propPage === 'number') {
      setPage(propPage)
    }
  }, [propPage])

  useImperativeHandle(ref, () => pagerRef.current)

  const pagePoses = useMemo(() => {
    return {
      current: variantStyles['page:pose:current'],
      next: variantStyles['page:pose:next'],
      previous: variantStyles['page:pose:previous'],
    }
  }, [variantStyles])

  return (
    <View style={variantStyles.wrapper}>
      {React.Children.map(children, (child, idx) => (
        <Page
          {...pagerProps}
          idx={idx}
          lastPage={lastPage}
          pagePoses={pagePoses}
          style={[variantStyles.page]}
          page={page}
        >
          {child}
        </Page>
      ))}

      {debug && (
        <View
          variants={['absolute']}
          style={{ bottom: 0, left: 0, right: 0 }}
        >
          <Button text='previous' debugName='Previous Pager' onPress={pagerRef.current.back} />
          <Text text={page.toString()} />
          <Button text='next' debugName='Next Pager' onPress={pagerRef.current.forward} />
        </View>
      )}
    </View>

  )
})
type PageProps = PagerProps & {
  idx: number
  lastPage: number
  page: number
  pagePoses: any
  style: any
}
const Page: React.FC<PageProps> = (pageProps) => {
  const {
    children: child,
    idx,
    loop,
    lastPage,
    page,
    style,
    pagePoses,
  } = pageProps

  if (!React.isValidElement(child)) return null

  // const isLast = idx === lastPage
  // const isFirst = idx === 0

  // const isLoopNext = (loop && isFirst && page === lastPage)
  // const isLoopPrevious = (loop && isLast && page === 0)

  // const isCurrent = idx === page
  // const isSequenceNext = idx ===  page + 1
  // const isSequencePrevious = idx ===  page  - 1

  // const isNext = isSequenceNext || isLoopNext

  // const isPrevious = isSequencePrevious || isLoopPrevious

  // const isCurrentOrAdjacent = [
  //     isCurrent,
  //     isNext,
  //     isPrevious
  // ].includes(true)

  // if(isCurrentOrAdjacent){
  //     return <Animated
  //         key={idx}
  //         component='View'
  //         config={pagePoses}
  //         pose={isCurrent ? 'current' : (isNext ? 'next' : 'previous')}
  //         style={[{
  //             position: 'absolute',
  //             top: 0,

  //         },style]}
  //     >
  //         {child}
  //     </Animated>
  // }
  const isCurrent = idx === page
  const isNext = idx > page
  const [_opacity, setOpacity] = useState(isCurrent ? 1 : 0)

  const [opacity, resetDebounceTimer] = useDebounce(_opacity, 800)

  onUpdate(() => {
    if (isCurrent) {
      setOpacity(1)
    } else {
      setOpacity(0)
    }

    return resetDebounceTimer
  }, [idx, page])

  return (
    <Animated
      key={idx}
      component='View'
      config={pagePoses}
      pose={isCurrent ? 'current' : isNext ? 'next' : 'previous'}
      style={[
        {
          position: 'absolute',
          top: 0,
          opacity: isCurrent ? _opacity : opacity,
        },
        style,
      ]}
    >
      {child}
    </Animated>
  )

  // return <View style={{display:'none'}} key={idx}>{child}</View>
}
