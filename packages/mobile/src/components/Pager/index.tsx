import {
  ComponentVariants,
  useDefaultComponentStyle,
} from '@codeleap/common'
import React, {
  ReactNode,
} from 'react'
import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types/utility'
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

export type PagerProps = React.PropsWithChildren<{
  variants?: ComponentVariants<typeof PagerStyles>['variants']
  styles?: StylesOf<PagerComposition>
  children?: (((pageData: PageProps) => ReactNode) | ReactNode)[]
  page?: number
  style?: any
  setPage?: (page: number) => void
  returnEarly?: boolean
  renderPageWrapper?:React.FC<PageProps>
  pageWrapperProps?: any
}>

export const Pager:React.FC<PagerProps> = (pagerProps) => {
  const {

    styles,
    variants,
    page,
    style = {},
    returnEarly = true,
    renderPageWrapper,
    pageWrapperProps = {},
    children,
  } = pagerProps

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


  const childArr = React.Children.toArray(children)

  const WrapperComponent = renderPageWrapper || View

  // Reamimated seems to glitch if this is not done
  variantStyles = JSON.parse(JSON.stringify(variantStyles))

  return (
    <View style={[variantStyles.wrapper, style]} >
      {
        childArr.map((child:PagerProps['children'][number], index) => {
          const isActive = index === page
          const isLast = index === lastPage
          const isFirst = index === 0
          const isNext = index === page + 1
          const isPrevious = index === page - 1
          const shouldRender = isActive || isNext || isPrevious

          if (!shouldRender && returnEarly) return null
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
            style: variantStyles.page,
            animated: true,
            transition: variantStyles['page:transition'],
            animate: [variantStyles['page:previous'], variantStyles['page:current'], variantStyles['page:next']][pos],
            ...pageWrapperProps,
          }

          return (
            <WrapperComponent {...wrapperProps}>
              {content}
            </WrapperComponent>
          )

        })
      }
    </View>
  )
}
