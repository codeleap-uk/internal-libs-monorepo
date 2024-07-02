import { onUpdate } from '@codeleap/common'
import Slider from 'react-slick'
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { View } from '../View'
import { Touchable } from '../Touchable'
import { DotsProps, PagerProps, PagerRef } from './types'
import { ComponentWithDefaultProps } from '../../types'
import { AnyRecord, GenericStyledComponentAttributes, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib'
import { useStylesFor } from '../../lib/hooks/useStylesFor'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export * from './styles'
export * from './types'

const Dots = (params: DotsProps) => {
  const { page, childArray, onPress, styles, dotsDisabled } = params

  return (
    <View style={styles.dots}>
      {childArray.map((_, index) => {
        const isSelected = index === page

        const style = [
          styles[isSelected ? 'dot:selected' : 'dot'],
          dotsDisabled && styles['dot:disabled'],
        ]

        return (
          <Touchable
            key={index}
            onPress={() => onPress?.(index)}
            style={style}
            disabled={dotsDisabled}
            debugName='dots'
          />
        )
      })}
    </View>
  )
}

export const Pager = forwardRef((props: PagerProps, ref: React.ForwardedRef<PagerRef>) => {
  const sliderRef = useRef<Slider>()

  const {
    style,
    children,
    renderPageWrapper: PageWrapper,
    page,
    dots,
    dotsDisabled,
    infinite,
    disableSwipe,
    onChange,
    footer,
    dotsProps,
    pageWrapperProps,
    ...rest
  } = {
    ...Pager.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Pager.styleRegistryName, style)

  const childArray = React.Children.toArray(children)

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
    <View style={styles.wrapper}>
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
            // @ts-expect-error @verify
            <PageWrapper
              key={index}
              style={styles.pageWrapper}
              {...pageWrapperProps}
            >
              {child}
            </PageWrapper>
          )
        })}
      </Slider>

      <View style={styles.footerWrapper}>
        {footer}

        {dots && (
          <Dots
            page={page}
            onPress={onChange}
            childArray={childArray}
            styles={styles}
            dotsDisabled={dotsDisabled}
            {...dotsProps}
          />
        )}
      </View>
    </View>
  )
}) as ComponentWithDefaultProps<PagerProps> & GenericStyledComponentAttributes<AnyRecord>

Pager.styleRegistryName = 'Pager'

Pager.elements = [
  'wrapper',
  'dot',
  'dot:selected',
  'dots',
  'pageWrapper',
  'footerWrapper',
]

Pager.rootElement = 'wrapper'

Pager.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Pager as (props: StyledComponentProps<PagerProps, typeof styles>) => IJSX
}

Pager.defaultProps = {
  dots: false,
  dotsDisabled: false,
  infinite: false,
  disableSwipe: false,
  renderPageWrapper: View,
} as Partial<PagerProps>

WebStyleRegistry.registerComponent(Pager)
