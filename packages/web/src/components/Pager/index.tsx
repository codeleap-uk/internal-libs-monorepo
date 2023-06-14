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
import { View } from '../View'
import { Touchable } from '../Touchable'

export type PagerRef = {
  goTo: (page: number) => void
}

export type PagerProps = Settings & {
  variants?: ComponentVariants<typeof PagerPresets>['variants']
  styles?: StylesOf<PagerComposition>
  page?: number
  style?: CSSProperties
  children: ReactNode
  onChange?: (page: number) => void
  renderPageWrapper?: React.FC
  footer?: ReactElement
}

type DotsProps = Pick<PagerProps, 'page'> & {
  childArray: ReactNode[]
  onPress?: (index: number) => void
  variantStyles: StylesOf<PagerComposition>
}

const Dots = ({ page, childArray, onPress, variantStyles }: DotsProps) => {
  return (
    <View style={variantStyles.dots}>
      {childArray.map((_, index) => {
        const isSelected = index === page

        return (
          <Touchable
            key={index}
            onPress={() => onPress?.(index)}
            style={variantStyles[isSelected ? 'dot' : 'dot:selected']}
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
    page,
    dots = false,
    infinite = false,
    onChange,
    footer,
    ...rest
  } = props

  const variantStyles = useDefaultComponentStyle<
    'u:Pager',
    typeof PagerPresets
  >('u:Pager', {
    variants,
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
  }))

  onUpdate(() => {
    goTo(page)
  }, [page])

  return (
    <View variants={variants} style={style || variantStyles.wrapper}>
      <Slider
        {...rest}
        arrows={false}
        ref={sliderRef}
        dots={false}
        infinite={infinite}
        accessibility={false}
        afterChange={onChange}
      >
        {childArray.map((child, index) => {
          return (
            <PageWrapper key={index} style={variantStyles.pageWrapper}>
              {child}
            </PageWrapper>
          )
        })}
      </Slider>

      <View variants={['column']}>
        {footer}

        {dots && (
          <Dots
            page={page}
            onPress={onChange}
            childArray={childArray}
            variantStyles={variantStyles}
          />
        )}
      </View>
    </View>
  )
}

export const Pager = forwardRef(PagerComponent)

export * from './styles'
