import {
  ComponentVariants,
  StylesOf,
  onUpdate,
  useDefaultComponentStyle,
} from '@codeleap/common'
import Slider, { Settings } from 'react-slick'
import { PagerComposition, PagerPresets } from './styles'
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  ReactNode,
  ReactElement,
  CSSProperties,
} from 'react'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { View, ViewProps } from '../View'
import { Touchable } from '../Touchable'
import { ComponentCommonProps } from '../../types'

export type PagerRef = {
  goTo: (page: number) => void
}

export type PagerProps = Settings &
  ComponentVariants<typeof PagerPresets> & {
    styles?: StylesOf<PagerComposition>
    page?: number
    style?: CSSProperties
    children: ReactNode
    onChange?: (page: number) => void
    renderPageWrapper?: React.FC
    footer?: ReactElement
    dotsProps?: DotsProps
    pageWrapperProps?: ViewProps<'div'>
    dotsDisabled?:boolean
    disableSwipe?: boolean
  } & ComponentCommonProps

type DotsProps = Pick<PagerProps, 'page' | 'dotsDisabled'> & {
  childArray: ReactNode[]
  onPress?: (index: number) => void
  variantStyles: StylesOf<PagerComposition>
}

const Dots = ({ page, childArray, onPress, variantStyles, dotsDisabled }: DotsProps) => {
  return (
    <View style={variantStyles.dots}>
      {childArray.map((_, index) => {
        const isSelected = index === page
        const css = [
          variantStyles[isSelected ? 'dot:selected' : 'dot'],
          dotsDisabled && variantStyles['dot:disabled'],
        ]

        return (
          <Touchable
            key={index}
            onPress={() => onPress?.(index)}
            css={css}
            disabled={dotsDisabled}
          />
        )
      })}
    </View>
  )
}

const PagerComponent = (
  props: PagerProps,
  ref: React.ForwardedRef<PagerRef>,
) => {
  const sliderRef = useRef<Slider>()
  const {
    styles,
    style,
    variants,
    children,
    renderPageWrapper,
    responsiveVariants,
    page,
    dots = false,
    dotsDisabled = false,
    infinite = false,
    disableSwipe = false,
    onChange,
    footer,
    dotsProps,
    pageWrapperProps,
    ...rest
  } = props

  const variantStyles = useDefaultComponentStyle<
    'u:Pager',
    typeof PagerPresets
  >('u:Pager', {
    variants,
    responsiveVariants,
    styles,
    rootElement: 'wrapper',
  })

  const childArray = React.Children.toArray(children)
  const PageWrapper = renderPageWrapper || View

  const goTo = useCallback(
    (page: number) => {
      if (sliderRef.current) sliderRef.current.slickGoTo(page)
    },
    [sliderRef?.current],
  )

  useImperativeHandle(ref, () => ({
    goTo,
    ...sliderRef.current,
  }), [!!sliderRef?.current])

  onUpdate(() => {
    goTo(page)
  }, [page])

  return (
    <View css={[variantStyles.wrapper, style]}>
      <Slider
        adaptiveHeight={true}
        {...rest}
        arrows={false}
        ref={sliderRef}
        dots={false}
        swipe={!disableSwipe}
        infinite={infinite}
        accessibility={false}
        afterChange={onChange}
      >
        {childArray.map((child, index) => {
          return (
            <PageWrapper
              key={index}
              css={variantStyles.pageWrapper}
              {...pageWrapperProps}
            >
              {child}
            </PageWrapper>
          )
        })}
      </Slider>

      <View css={variantStyles.footerWrapper}>
        {footer}

        {dots && (
          <Dots
            page={page}
            onPress={onChange}
            childArray={childArray}
            variantStyles={variantStyles}
            dotsDisabled={dotsDisabled}
            {...dotsProps}
          />
        )}
      </View>
    </View>
  )
}

export const Pager = forwardRef(PagerComponent)

export * from './styles'
