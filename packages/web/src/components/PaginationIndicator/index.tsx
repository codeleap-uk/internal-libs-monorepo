import React from 'react'
import {
  ActivityIndicatorComposition,
  TypeGuards,
  capitalize,
} from '@codeleap/common'
import { ActivityIndicator } from '../ActivityIndicator'
import { Text } from '../Text'
import { View } from '../View'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { PaginationIndicatorProps } from './types'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'

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
    return activityIndicator || <View css={styles.wrapper}><ActivityIndicator debugName={debugName} {...indicatorProps} styles={loaderStyles}/></View>
  }

  if (!hasMore) {
    if (TypeGuards.isString(noMoreItemsText) || TypeGuards.isNumber(noMoreItemsText)) {
      return <Text debugName={debugName} css={styles.text} text={noMoreItemsText.toString()}/>
    }
    return noMoreItemsText
  }

  return null
}

PaginationIndicator.styleRegistryName = 'PaginationIndicator'
PaginationIndicator.elements = ['wrapper', 'text', `loader${capitalize<ActivityIndicatorComposition>}`]
PaginationIndicator.rootElement = 'wrapper'

PaginationIndicator.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return PaginationIndicator as (props: StyledComponentProps<PaginationIndicatorProps, typeof styles>) => IJSX
}

PaginationIndicator.defaultProps = {} as Partial<PaginationIndicatorProps>

WebStyleRegistry.registerComponent(PaginationIndicator)

export * from './styles'
export * from './types'
