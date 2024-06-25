import React from 'react'
import { TypeGuards } from '@codeleap/common'
import { ActivityIndicator } from '../ActivityIndicator'
import { Text } from '../Text'
import { View } from '../View'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { PaginationIndicatorProps } from './types'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'

export * from './styles'
export * from './types'

export const PaginationIndicator = (props: PaginationIndicatorProps) => {
  const {
    hasMore,
    isFetching,
    noMoreItemsText,
    activityIndicator,
    style,
    indicatorProps,
    debugName,
  } = {
    ...PaginationIndicator.defaultProps,
    ...props,
  }

  const styles = useStylesFor(PaginationIndicator.styleRegistryName, style)

  const loaderStyles = useNestedStylesByKey('loader', styles)

  if (isFetching) {
    return activityIndicator || (
      <View style={styles.wrapper}>
        <ActivityIndicator debugName={debugName} {...indicatorProps} style={loaderStyles} />
      </View>
    )
  }

  if (!hasMore) {
    if (TypeGuards.isString(noMoreItemsText) || TypeGuards.isNumber(noMoreItemsText)) {
      return (
        <Text
          debugName={debugName}
          style={styles.text}
          text={String(noMoreItemsText)}
        />
      )
    }

    return noMoreItemsText
  }

  return null
}

PaginationIndicator.styleRegistryName = 'PaginationIndicator'
PaginationIndicator.elements = ['wrapper', 'text', 'loader']
PaginationIndicator.rootElement = 'wrapper'

PaginationIndicator.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return PaginationIndicator as (props: StyledComponentProps<PaginationIndicatorProps, typeof styles>) => IJSX
}

PaginationIndicator.defaultProps = {} as Partial<PaginationIndicatorProps>

WebStyleRegistry.registerComponent(PaginationIndicator)
