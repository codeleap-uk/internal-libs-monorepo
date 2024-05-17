import React from 'react'
import { TypeGuards } from '@codeleap/common'
import { ActivityIndicator, ActivityIndicatorComposition } from '../ActivityIndicator'
import { Text } from '../Text'
import { AnyRecord, getNestedStylesByKey, IJSX, StyledComponentProps, StyledProp } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'

export type PaginationIndicatorComposition = 'text' | `loader${Capitalize<ActivityIndicatorComposition>}`

export type PaginationIndicatorProps = {
  isFetching?: boolean
  noMoreItemsText: JSX.Element | string | number
  hasMore?: boolean
  activityIndicator?: JSX.Element
  style?: StyledProp<PaginationIndicatorComposition>
}

export const PaginationIndicator = (props: PaginationIndicatorProps) => {
  const {
    hasMore,
    isFetching,
    noMoreItemsText,
    style,
    activityIndicator
  } = {
    ...PaginationIndicator.defaultProps,
    ...props,
  }

  const styles = MobileStyleRegistry.current.styleFor(PaginationIndicator.styleRegistryName, style)

  const loaderStyles = getNestedStylesByKey('loader', styles)

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

PaginationIndicator.defaultProps = {}

MobileStyleRegistry.registerComponent(PaginationIndicator)
