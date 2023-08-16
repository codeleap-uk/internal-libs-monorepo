import React from 'react'
import { StylesOf } from '@codeleap/common'
import { ListComposition, ListParts } from './styles'
import { ListProps } from './types'
import { View } from '../View'
import { UseInfiniteScrollReturn } from './useInfiniteScroll'
import { ActivityIndicator } from '../ActivityIndicator'
import { motion } from 'framer-motion'

type ListLayoutProps = Omit<ListProps, 'renderItem'> & UseInfiniteScrollReturn['layoutProps'] & {
  variantStyles: StylesOf<ListComposition>
  children?: React.ReactNode
}

type ListRefreshControlComponent = Partial<ListLayoutProps> & {
  enabled: boolean
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
    enabled,
  } = props

  if (!enabled) return null
  
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
  } = props

  const getKeyStyle = React.useCallback((key: ListParts) => ([
    variantStyles[key],
    isLoading && variantStyles[`${key}:loading`],
    isEmpty && variantStyles[`${key}:empty`],
  ]), [isLoading, isEmpty])

  return (
    <View css={[getKeyStyle('wrapper'), style]} ref={scrollableRef}>
      {!!ListHeaderComponent ? <ListHeaderComponent /> : null}

      {isEmpty
        ? <ListEmptyComponent debugName={debugName} {...placeholder} />
        : (
          <View css={[getKeyStyle('innerWrapper')]}>
            <ListRefreshControlComponent
              {...props}
              enabled={refresh}
              variantStyles={variantStyles}
            />

            {children}
          </View>
        )}

      {(isFetching || isFetchingNextPage) ? <ListLoadingIndicatorComponent /> : null}

      {!!ListFooterComponent ? <ListFooterComponent /> : null}
    </View>
  )
}
