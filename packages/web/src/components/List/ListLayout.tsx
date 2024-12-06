import React from 'react'
import { View } from '../View'
import { ListLayoutProps, ListRefreshControlComponent } from './types'
import { mergeStyles } from '@codeleap/styles'
import { ActivityIndicator } from '../ActivityIndicator'
import { ListParts } from './styles'
import { TypeGuards } from '@codeleap/types'
import { motion } from 'framer-motion'

const DefaultRefreshIndicator = (props: ListRefreshControlComponent) => {
  const {
    refreshing,
    styles,
    refreshPosition,
    refreshControlProps,
    debugName,
    refreshSize,
    refreshControlIndicatorProps,
  } = props

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: refreshing ? 1 : 0,
        top: refreshing ? refreshPosition : 0,
      }}
      {...refreshControlProps}
      style={styles?.refreshControl}
    >
      <ActivityIndicator
        debugName={debugName + 'refresh-indicator'}
        size={refreshSize}
        {...refreshControlIndicatorProps}
        style={styles.refreshControlIndicator}
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
    styles,
    isEmpty,
    isLoading,
    placeholder = {},
    children,
    debugName,
    isFetching,
    isFetchingNextPage,
    ListLoadingIndicatorComponent,
    scrollableRef,
    showFooter = true,
    wrapperProps,
  } = props

  const getKeyStyle = (key: ListParts) => mergeStyles([
    styles[key],
    isLoading ? styles[`${key}:loading`] : null,
    isEmpty ? styles[`${key}:empty`] : null,
  ])

  const showIndicator = (isFetching || isFetchingNextPage) && !TypeGuards.isNil(ListLoadingIndicatorComponent)

  return (
    <View style={getKeyStyle('wrapper')} ref={scrollableRef} {...wrapperProps}>
      {!!ListHeaderComponent ? <ListHeaderComponent /> : null}

      {isEmpty ? <ListEmptyComponent debugName={debugName} {...placeholder} /> : null}

      <View style={[getKeyStyle('innerWrapper'), isEmpty && { display: 'none' }]}>
        {(!ListRefreshControlComponent || !refresh) ? null : <ListRefreshControlComponent {...props} styles={styles} />}

        {children}
      </View>

      {showIndicator ? <ListLoadingIndicatorComponent /> : null}

      {(!!ListFooterComponent && showFooter) ? <ListFooterComponent {...props} /> : null}
    </View>
  )
}
