import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ReduceMotion } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { CarouselRenderItemInfo, TCarouselProps } from 'react-native-reanimated-carousel/lib/typescript/types'
import { Dimensions, LayoutChangeEvent } from 'react-native'
import { useConditionalState } from '@codeleap/hooks'
import { AnyRecord, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'
import { useStylesFor } from '../../hooks'
import { MobileStyleRegistry } from '../../Registry'
import { View } from '../View'
import { PageProps, PagerProps } from './types'
import { PagerDots } from './PagerDots'
import { PagerItem } from './PagerItem'

export * from './styles'
export * from './types'
export * from './PagerDots'

const window = Dimensions.get('screen')

export function Pager<T>(props: PagerProps<T>) {
  const {
    pages,
    page,
    onChangePage,
    initialPage,
    style,
    showDots,
    renderItem,
    footer,
    width: carouselWidth,
    height: carouselHeight,
    autoCalculateFooterHeight,
    removeFixedHeight,
    removeFixedWidth,
    ...rest
  } = {
    ...Pager.defaultProps,
    ...props,
  }

  const carouselRef = useRef<ICarouselInstance>(null)

  const [currentPage, setCurrentPage] = useConditionalState(page, onChangePage, { initialValue: initialPage })
  const [footerHeight, setFooterHeight] = useState(0)
  const [loaded, setLoaded] = useState(!showDots && !footer ? true : false)

  const styles = useStylesFor(Pager.styleRegistryName, style)
  const dotStyles = useNestedStylesByKey('dot', styles)

  useEffect(() => {
    if (carouselRef.current?.getCurrentIndex?.() !== currentPage) {
      carouselRef.current?.scrollTo?.({ index: currentPage, animated: true })
    }
  }, [currentPage])

  const getItemInfo = useCallback((index: number) => {
    const info: Omit<PageProps<T>, 'item' | 'animationValue'> = {
      isFirst: index === 0,
      isLast: index === pages?.length - 1,
      isOnly: pages?.length === 1,
      index,
    }

    return info
  }, [])

  const customRenderItem = useCallback(({ item, index, animationValue }: CarouselRenderItemInfo<any>) => {
    const info = getItemInfo(index)

    return (
      <PagerItem
        {...info}
        renderItem={renderItem}
        item={item}
        animationValue={animationValue}
      />
    )
  }, [renderItem, getItemInfo])

  const onFooterLayout = useCallback((event: LayoutChangeEvent) => {
    setFooterHeight(event.nativeEvent.layout.height)
    setTimeout(() => setLoaded(true), 0)
  }, [])

  const width = carouselWidth - removeFixedWidth
  const height = carouselHeight - ((autoCalculateFooterHeight ? footerHeight : 0) + removeFixedHeight)

  return (
    <View style={[{ width, opacity: !loaded ? 0 : 1 }, styles.wrapper]}>
      {/* @ts-ignore */}
      <Carousel
        data={pages}
        autoPlay={false}
        loop={false}
        overscrollEnabled={false}
        pagingEnabled={false}
        ref={carouselRef}
        defaultIndex={initialPage}
        onSnapToItem={setCurrentPage}
        maxScrollDistancePerSwipe={carouselWidth}
        minScrollDistancePerSwipe={carouselWidth * 0.1}
        width={width}
        height={height}
        renderItem={customRenderItem}
        withAnimation={{
          type: 'timing',
          config: {
            reduceMotion: ReduceMotion.Never,
          },
        }}
        {...rest as TCarouselProps<T>}
        style={styles.carousel}
      />

      <View onLayout={onFooterLayout} style={styles.footerWrapper}>
        {footer}

        {showDots ? (
          <PagerDots currentPage={currentPage} pages={pages} setCurrentPage={setCurrentPage} styles={dotStyles} />
        ) : null}
      </View>
    </View>
  )
}

Pager.styleRegistryName = 'Pager'
Pager.elements = ['carousel', 'wrapper', 'footerWrapper', 'dot']
Pager.rootElement = 'wrapper'

Pager.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Pager as <T >(props: StyledComponentProps<PagerProps<T>, typeof styles>) => IJSX
}

Pager.defaultProps = {
  width: window.width,
  height: window.height,
  showDots: true,
  autoCalculateFooterHeight: true,
  initialPage: 0,
  footer: null,
  removeFixedHeight: 0,
  removeFixedWidth: 0,
} as Partial<PagerProps<unknown>>

MobileStyleRegistry.registerComponent(Pager)
