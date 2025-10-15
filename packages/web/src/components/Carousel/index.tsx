import { onUpdate } from '@codeleap/hooks'
import React, { forwardRef, useCallback, useImperativeHandle, useEffect, useState, useMemo } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import type { EmblaCarouselType } from 'embla-carousel'
import { View } from '../View'
import { Touchable } from '../Touchable'
import { DotsProps, CarouselProps, CarouselRef } from './types'
import { AnyRecord, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { useStylesFor } from '../../lib/hooks/useStylesFor'

export * from './styles'
export * from './types'

const Dots = (params: DotsProps) => {
  const { page, childArray, onPress, styles, dotsDisabled } = params

  return (
    <View style={styles.dots}>
      {childArray.map((_, index) => {
        const isSelected = index === page

        const style = [
          styles.dot,
          isSelected && styles['dot:selected'],
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

export const Carousel = forwardRef<CarouselRef, CarouselProps>((props, ref) => {
  const {
    style,
    children,
    renderSlideWrapper: SlideWrapper,
    page,
    dots,
    dotsDisabled,
    infinite,
    disableSwipe,
    onChange,
    footer,
    dotsProps,
    slideWrapperProps,
    autoplay,
    autoplayDelay,
    spaceBetween,
    slidesPerView,
    ...rest
  } = {
    ...Carousel.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Carousel.styleRegistryName, style)
  const childArray = React.Children.toArray(children)

  const [currentIndex, setCurrentIndex] = useState(0)

  const plugins = useMemo(() => {
    const pluginList = []
    if (autoplay) {
      pluginList.push(Autoplay({ delay: autoplayDelay, stopOnInteraction: false }))
    }
    return pluginList
  }, [autoplay, autoplayDelay])

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: infinite,
      dragFree: false,
      containScroll: 'trimSnaps',
      align: 'start',
      slidesToScroll: 1,
      ...(disableSwipe && { watchDrag: false }),
    },
    plugins,
  )

  const goTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index)
      }
    },
    [emblaApi],
  )

  const next = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  const prev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  useImperativeHandle(
    ref,
    () => ({
      goTo,
      next,
      prev,
      emblaApi,
    }),
    [goTo, next, prev, emblaApi],
  )

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap()
      setCurrentIndex(index)
      onChange?.(index)
    }

    emblaApi.on('select', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onChange])

  onUpdate(() => {
    if (page !== undefined && page !== currentIndex && emblaApi) {
      goTo(page)
    }
  }, [page])

  return (
    <View style={styles.wrapper}>
      <View
        ref={emblaRef}
        style={{
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: spaceBetween,
          }}
        >
          {childArray.map((child, index) => {
            return (
              <View
                key={index}
                style={{
                  flex: slidesPerView === 1 ? '0 0 100%' : slidesPerView === 'auto' ? '0 0 auto' : `0 0 ${100 / slidesPerView}%`,
                  minWidth: 0,
                }}
              >
                <SlideWrapper
                  style={styles.slideWrapper}
                  {...slideWrapperProps}
                >
                  {child}
                </SlideWrapper>
              </View>
            )
          })}
        </View>
      </View>

      <View style={styles.footerWrapper}>
        {footer}

        {dots ? (
          <Dots
            page={currentIndex}
            onPress={goTo}
            childArray={childArray}
            styles={styles}
            dotsDisabled={dotsDisabled}
            {...dotsProps}
          />
        ) : null}
      </View>
    </View>
  )
}) as StyledComponentWithProps<CarouselProps>

Carousel.styleRegistryName = 'Carousel'

Carousel.elements = [
  'wrapper',
  'dot',
  'dots',
  'slideWrapper',
  'footerWrapper',
]

Carousel.rootElement = 'wrapper'

Carousel.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Carousel as (props: StyledComponentProps<CarouselProps, typeof styles>) => IJSX
}

Carousel.defaultProps = {
  dots: false,
  dotsDisabled: false,
  infinite: false,
  disableSwipe: false,
  renderSlideWrapper: View,
  autoplay: false,
  autoplayDelay: 3000,
  spaceBetween: 0,
  slidesPerView: 1,
} as Partial<CarouselProps>

WebStyleRegistry.registerComponent(Carousel)
