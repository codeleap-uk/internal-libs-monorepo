import React from 'react'
import { StylesOf, TypeGuards } from '@codeleap/common'
import { ListComposition, ListParts } from './styles'
import { ListProps } from './types'
import { View } from '../View'
import { UseInfiniteScrollReturn } from './useInfiniteScroll'
import { ActivityIndicator } from '../ActivityIndicator'
import { motion } from 'framer-motion'

export type ListLayoutProps = Omit<ListProps, 'renderItem'> & UseInfiniteScrollReturn['layoutProps'] & {
  variantStyles: StylesOf<ListComposition>
  children?: React.ReactNode
  showFooter?: boolean
}

type ListRefreshControlComponent = Partial<ListLayoutProps> & {
  variantStyles: StylesOf<ListComposition>
}

const DefaultRefreshIndicator = (props: ListRefreshControlComponent) => {
  const {
    refreshing,
    variantStyles,
    refreshPosition,
    refreshControlProps,
    debugName,
    refreshSize,
    refreshControlIndicatorProps,
  } = props

  return (
    <motion.div
      css={[variantStyles?.refreshControl]}
      initial={false}
      animate={{
        opacity: refreshing ? 1 : 0,
        top: refreshing ? refreshPosition : 0
      }}
      {...refreshControlProps}
    >
      <ActivityIndicator
        debugName={debugName + 'refresh-indicator'}
        size={refreshSize}
        style={variantStyles.refreshControlIndicator}
        {...refreshControlIndicatorProps}
      />
    </motion.div>
  )
}

export const ListLayout = (props: ListLayoutProps) => {
  const {
    ListEmptyComponent,
    ListFooterComponent,
    ListHeaderComponent,
    refresh,
    ListRefreshControlComponent = DefaultRefreshIndicator,
    variantStyles,
    isEmpty,
    isLoading,
    placeholder = {},
    style,
    children,
    debugName,
    isFetching,
    isFetchingNextPage,
    ListLoadingIndicatorComponent,
    scrollableRef,
    showFooter = true,
  } = props

  const getKeyStyle = React.useCallback((key: ListParts) => ([
    variantStyles[key],
    isLoading && variantStyles[`${key}:loading`],
    isEmpty && variantStyles[`${key}:empty`],
  ]), [isLoading, isEmpty])

  return (
    <View css={[getKeyStyle('wrapper'), style]} ref={scrollableRef}>
      {!!ListHeaderComponent ? <ListHeaderComponent /> : null}

      {isEmpty ? <ListEmptyComponent debugName={debugName} {...placeholder} /> : null}

      <View css={[getKeyStyle('innerWrapper'), isEmpty && { display: 'none' }]}>
        {(!ListRefreshControlComponent || !refresh) ? null : (
          <ListRefreshControlComponent
            {...props}
            variantStyles={variantStyles}
          />
        )}

        {children}
      </View>

      {((isFetching || isFetchingNextPage) && !TypeGuards.isNil(ListLoadingIndicatorComponent))
        ? <ListLoadingIndicatorComponent />
        : null}

      {(!!ListFooterComponent && showFooter) ? <ListFooterComponent {...props} /> : null}
    </View>
  )
}
