import React, { useCallback, useRef } from 'react'
import { ReduceMotion } from 'react-native-reanimated'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types'
import { Dimensions } from 'react-native'
import { onUpdate, TypeGuards, useConditionalState } from '@codeleap/common'
import {
  AnyRecord,
  AppTheme,
  IJSX,
  StyledComponentProps,
  Theme,
  useCompositionStyles,
  useTheme,
} from '@codeleap/styles'
import { useStylesFor } from '../../hooks'
import { MobileStyleRegistry } from '../../Registry'
import { View } from '../View'
import { PageProps, PagerProps } from './types'
import { PagerDots } from './components'

export * from './styles'
export * from './types'

export const Pager = (pagerProps: PagerProps) => {
  const { pages, page, setPage, initialPage, style, showDots, renderItem, footer, ...props } = {
    ...Pager.defaultProps,
    ...pagerProps,
  }
  const [currentPage, setCurrentPage] = useConditionalState(page, setPage, { initialValue: initialPage })
  const carouselRef = useRef<ICarouselInstance>(null)
  const theme = useTheme((store) => store.current) as AppTheme<Theme>
  const styles = useStylesFor(Pager.styleRegistryName, style)

  const { dot } = useCompositionStyles(['dot'], styles)

  onUpdate(() => {
    carouselRef.current?.scrollTo({ index: page, animated: true })
  }, [currentPage])

  const _renderItem = useCallback(
    ({ item, index, animationValue }: CarouselRenderItemInfo<any>) => {
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
    },
    [renderItem, pages, currentPage],
  )

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
      <View style={styles.innerWrapper}>
        {footer}
        {showDots && <PagerDots currentPage={currentPage} pages={pages} setCurrentPage={setCurrentPage} styles={dot} />}
      </View>
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
