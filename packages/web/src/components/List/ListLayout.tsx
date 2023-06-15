import React from 'react'
import { TypeGuards, useCodeleapContext } from '@codeleap/common'
import { ListParts } from './styles'
import { ListProps } from './types'
import { View } from '../View'
import { UseInfiniteScrollReturn } from './useInfiniteScroll'
import { ActivityIndicator } from '../ActivityIndicator'
import { motion } from 'framer-motion'

type ListLayoutProps = Omit<ListProps, 'renderItem'> & UseInfiniteScrollReturn['layoutProps'] & {
  variantStyles: any
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
    parentRef,
    style,
    dataVirtualizer,
    refresh,
    refreshing,
    refreshControlProps,
    refreshSize,
    children,
    ref,
  } = props

  const { Theme } = useCodeleapContext()

  const getKeyStyle = React.useCallback((key: ListParts) => {
    return [
      variantStyles[key],
      isLoading && variantStyles[`${key}:loading`],
      isEmpty && variantStyles[`${key}:empty`],
    ]
  }, [isLoading, isEmpty])

  const _refreshPosition = React.useMemo(() => {
    return Theme.spacing.value(refreshPosition)
  }, [refreshPosition])

  return (
    // @ts-ignore
    <View css={[getKeyStyle('wrapper'), style]}>
      {!!ListHeaderComponent && <ListHeaderComponent />}

      {isEmpty ? <ListEmptyComponent {...placeholder} /> : (
        <View
          ref={parentRef}
          css={[getKeyStyle('innerWrapper')]}
        >
          <View
            //@ts-ignore
            ref={ref}
            css={[
              getKeyStyle('content'),
              { height: dataVirtualizer.getTotalSize() }
            ]}
          >
            {TypeGuards.isNil(ListRefreshControlComponent) && refresh ? (
              <motion.div
                css={[variantStyles?.refreshControl]}
                initial={false}
                animate={{
                  opacity: refreshing ? 1 : 0,
                  top: refreshing ? _refreshPosition : 0
                }}
                {...refreshControlProps}
              >
                <ActivityIndicator size={refreshSize} />
              </motion.div>
            ) : (<ListRefreshControlComponent /> ?? null)}

            {children}
          </View>
        </View>
      )}

      {!!ListFooterComponent && <ListFooterComponent />}
    </View>
  )
}
