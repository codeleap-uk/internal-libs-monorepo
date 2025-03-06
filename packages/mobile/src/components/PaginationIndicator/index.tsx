import React from 'react'
import { TypeGuards } from '@codeleap/types'
import { ActivityIndicator } from '../ActivityIndicator'
import { Text } from '../Text'
import { AnyRecord, useNestedStylesByKey, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { PaginationIndicatorProps } from './types'

export * from './styles'
export * from './types'

export const PaginationIndicator = (props: PaginationIndicatorProps) => {
  const {
    hasMore,
    isFetching,
    noMoreItemsText,
    style,
    activityIndicator,
  } = {
    ...PaginationIndicator.defaultProps,
    ...props,
  }

  const styles = useStylesFor(PaginationIndicator.styleRegistryName, style)

  const loaderStyles = useNestedStylesByKey('loader', styles)

  if (isFetching) {
    return activityIndicator || <ActivityIndicator style={loaderStyles} />
  }

  if (!hasMore) {
    if (TypeGuards.isString(noMoreItemsText) || TypeGuards.isNumber(noMoreItemsText)) {
      return <Text style={styles.text} text={noMoreItemsText.toString()} />
    }

    return noMoreItemsText
  }

  return null
}

PaginationIndicator.styleRegistryName = 'PaginationIndicator'
PaginationIndicator.elements = ['text', 'loader']
PaginationIndicator.rootElement = 'text'

PaginationIndicator.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return PaginationIndicator as (props: StyledComponentProps<PaginationIndicatorProps, typeof styles>) => IJSX
}

PaginationIndicator.defaultProps = {} as PaginationIndicatorProps

MobileStyleRegistry.registerComponent(PaginationIndicator)
