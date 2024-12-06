import React, { useCallback, useRef, useState } from 'react'
import { ReduceMotion } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { CarouselRenderItemInfo, TCarouselProps } from 'react-native-reanimated-carousel/lib/typescript/types'
import { Dimensions, LayoutChangeEvent } from 'react-native'
import { TypeGuards } from '@codeleap/types'
import { onUpdate, useConditionalState } from '@codeleap/hooks'
import { AnyRecord, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'
import { useStylesFor } from '../../hooks'
import { MobileStyleRegistry } from '../../Registry'
import { View } from '../View'
import { PageProps, PagerProps } from './types'
import { PagerDots } from './PagerDots'

export * from './styles'
export * from './types'
export * from './PagerDots'

const window = Dimensions.get('window')

export function Pager<T>(props: PagerProps<T>) {
  const {
    pages,
    page,
    onChangePage,
    initialPage,
    style,
    showDots,
    renderItem: RenderItem,
    footer,
    width: carouselWidth,
    height: carouselHeight,
    autoCalculateFooterHeight,
    ...rest
  } = {
    ...Pager.defaultProps,
    ...props,
  }

  const [currentPage, setCurrentPage] = useConditionalState(page, onChangePage, { initialValue: initialPage })
  const carouselRef = useRef<ICarouselInstance>(null)
  const [footerHeight, setFooterHeight] = useState(0)

  const styles = useStylesFor(Pager.styleRegistryName, style)
  const dotStyles = useNestedStylesByKey('dot', styles)

  onUpdate(() => {
    carouselRef.current?.scrollTo({ index: currentPage, animated: true })
  }, [currentPage])

  const renderItem = useCallback(({ item, index, animationValue }: CarouselRenderItemInfo<any>) => {
    const itemProps: Omit<PageProps<T>, 'item'> = {
      isFirst: index === 0,
      isLast: index === pages?.length - 1,
      isOnly: pages?.length === 1,
      isActive: index === currentPage,
      isNext: index === currentPage + 1,
      isPrevious: index === currentPage - 1,
      index,
      animationValue,
    }

    if (TypeGuards.isFunction(item)) {
      const ItemComponent = item
      return <ItemComponent {...itemProps} />
    }

    return <RenderItem {...itemProps} item={item} />
  }, [RenderItem, pages?.length, currentPage])

  return (
    <View style={styles.wrapper}>
      <Carousel
        data={pages}
        withAnimation={{
          type: 'timing',
          config: {
            reduceMotion: ReduceMotion.Never,
          },
        }}
        autoPlay={false}
        ref={carouselRef}
        loop={false}
        defaultIndex={initialPage}
        onSnapToItem={setCurrentPage}
        maxScrollDistancePerSwipe={carouselWidth}
        width={carouselWidth}
        height={carouselHeight - (autoCalculateFooterHeight ? footerHeight : 0)}
        renderItem={renderItem}
        {...rest as TCarouselProps<T>}
        style={styles.carousel}
      />

      <View onLayout={(event: LayoutChangeEvent) => setFooterHeight(event.nativeEvent.layout.height)} style={styles.footerWrapper}>
        {/* {footer} */}
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
} as Partial<PagerProps<unknown>>

MobileStyleRegistry.registerComponent(Pager)
