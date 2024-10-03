import React, { useCallback, useRef, useState } from 'react'
import { onUpdate, TypeGuards } from '@codeleap/common'
import {
  AnyRecord,
  AppTheme,
  getNestedStylesByKey,
  IJSX,
  StyledComponentProps,
  Theme,
  useTheme,
} from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { View } from '../View'
import { PageProps, PagerProps } from './types'
import { useStylesFor } from '../../hooks'
import { ReduceMotion } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { Touchable } from '../Touchable'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { uuid } from '../..'
import { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types'
import { Dimensions } from 'react-native'

export * from './styles'
export * from './types'

export function PageDot({ onPress, isActive, index, styles }) {
  const animation = useAnimatedStyle(() => {
    const scale = isActive ? 1 : 0.6
    return {
      transform: [{ scale }],
      ...(isActive ? styles['dot:active'] : styles.dot),
    }
  })

  return (
    <Touchable
      debugName={`dot-touchable-${index}`}
      onPress={onPress}
      noFeedback
      style={[styles.touchable, isActive && styles['touchable:active']]}
    >
      <Animated.View style={[animation, styles.dot]} />
    </Touchable>
  )
}

export const Pager = (pagerProps: PagerProps) => {
  const {
    pages,
    page,
    setPage,
    initialPage,
    style,
    showDots,
    renderItem,
    ...props
  } = {
    ...Pager.defaultProps,
    ...pagerProps,
  }

  const theme = useTheme((store) => store.current) as AppTheme<Theme>
  const styles = useStylesFor(Pager.styleRegistryName, style)

  const [currentPage, setCurrentPage] = !TypeGuards.isNil(page) && TypeGuards.isFunction(setPage) ? [page, setPage] : useState(initialPage)
  const carouselRef = useRef<ICarouselInstance>(null)

  onUpdate(() => {
    carouselRef.current?.scrollTo({ index: page, animated: true })
  }, [currentPage])

  const _renderItem = useCallback(({ item, index, animationValue }: CarouselRenderItemInfo<any>) => {
    const itemProps: PageProps = {
      isFirst: index === 0,
      isLast: index === pages?.length - 1,
      isOnly: pages?.length === 1,
      isActive: index === currentPage,
      isNext: index === currentPage + 1,
      isPrevious: index === currentPage - 1,
      index,
      item,
      animationValue,
    }
    if (TypeGuards.isFunction(renderItem)) return renderItem(itemProps)
    if (TypeGuards.isFunction(item)) return item(itemProps)
  }, [renderItem, pages, currentPage])

  return (
    <View>
      <Carousel
        data={pages}
        withAnimation={{
          type: 'timing',
          config: { reduceMotion: ReduceMotion.Never },
        }}
        autoPlay={false}
        ref={carouselRef}
        windowSize={8}
        defaultIndex={initialPage}
        onSnapToItem={setCurrentPage}
        maxScrollDistancePerSwipe={theme.values.width}
        renderItem={_renderItem}
        {...props}
      />
      {showDots ? (
        <View style={styles.dotsWrapper}>
          {pages?.map((_, i) => (
            <PageDot
              key={`${uuid.v1}-index-${i}`}
              index={i}
              onPress={() => setCurrentPage(i)}
              isActive={i === currentPage}
              styles={getNestedStylesByKey('dot', styles)}
            />
          ))}
        </View>
      ) : null}
    </View>
  )
}

Pager.styleRegistryName = 'Pager'
Pager.elements = ['page', 'wrapper']
Pager.rootElement = 'wrapper'

Pager.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Pager as (props: StyledComponentProps<PagerProps, typeof styles>) => IJSX
}

const window = Dimensions.get('window')

Pager.defaultProps = {
  width: window.width,
  height: window.height,
  showDots: true,
  initialPage: 0,
} as Partial<PagerProps>

MobileStyleRegistry.registerComponent(Pager)
