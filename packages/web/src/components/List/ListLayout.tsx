import React from 'react'
import { StylesOf, TypeGuards } from '@codeleap/common'
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

export const ListLayout = (props: ListLayoutProps) => {
  const {
    ListEmptyComponent,
    ListFooterComponent,
    ListHeaderComponent,
    ListRefreshControlComponent,
    variantStyles,
    isEmpty,
    isLoading,
    refreshPosition,
    placeholder = {},
    style,
    refresh,
    refreshing,
    refreshControlProps,
    refreshControlIndicatorProps = {},
    refreshSize,
    children,
    debugName,
  } = props

  const getKeyStyle = React.useCallback((key: ListParts) => ([
    variantStyles[key],
    isLoading && variantStyles[`${key}:loading`],
    isEmpty && variantStyles[`${key}:empty`],
  ]), [isLoading, isEmpty])

  const RefreshIndicator = React.useCallback(() => {
    if (TypeGuards.isNil(ListRefreshControlComponent) && refresh) {
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
            debugName={debugName}
            size={refreshSize}
            style={variantStyles.refreshControlIndicator}
            {...refreshControlIndicatorProps}
          />
        </motion.div>
      )
    } else {
      return <ListRefreshControlComponent /> ?? null
    }
  }, [refresh, refreshing])

  return (
    // @ts-ignore
    <View css={[getKeyStyle('wrapper'), style]}>
      {!!ListHeaderComponent ? <ListHeaderComponent /> : null}

      {isEmpty
        ? <ListEmptyComponent debugName={debugName} {...placeholder} />
        : (
          <View css={[getKeyStyle('innerWrapper')]}>
            <RefreshIndicator />
            {children}
          </View>
        )}

      {!!ListFooterComponent ? <ListFooterComponent /> : null}
    </View>
  )
}
