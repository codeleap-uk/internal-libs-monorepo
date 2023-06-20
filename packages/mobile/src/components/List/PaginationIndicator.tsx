import React from 'react'
import {
  ComponentVariants,
  createDefaultVariantFactory,
  getNestedStylesByKey,
  includePresets,
  TypeGuards,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { StyleSheet, ViewStyle } from 'react-native'
import { StylesOf } from '../../types'
import { ActivityIndicator, ActivityIndicatorComposition } from '../ActivityIndicator'
import { Text } from '../Text'

export type PaginationIndicatorComposition = 'text' | `loader${Capitalize<ActivityIndicatorComposition>}`

const createPaginationIndicatorStyle = createDefaultVariantFactory<PaginationIndicatorComposition>()

export const PaginationIndicatorPresets = includePresets((style) => createPaginationIndicatorStyle(() => ({ loaderWrapper: style, text: style })))

export type PaginationIndicatorProps = {
  isFetching?: boolean
  noMoreItemsText: React.ReactChild
  hasMore?: boolean
  activityIndicator?: JSX.Element
  styles?: StylesOf<PaginationIndicatorComposition>
  style?: ViewStyle
} & ComponentVariants<typeof PaginationIndicatorPresets>

export const PaginationIndicator = (props: PaginationIndicatorProps) => {
  const { hasMore, isFetching, noMoreItemsText, style, activityIndicator, styles = {}, variants = [] } = props

  const variantStyles = useDefaultComponentStyle<
    'u:PaginationIndicator',
    typeof PaginationIndicatorPresets
    >('u:PaginationIndicator', {
      variants,
      styles,
      transform: StyleSheet.flatten,
    })

  const loaderStyles = getNestedStylesByKey('loader', variantStyles)

  if (isFetching) {
    return activityIndicator || <ActivityIndicator style={style} styles={loaderStyles}/>
  }
  if (!hasMore) {
    if (TypeGuards.isString(noMoreItemsText) || TypeGuards.isNumber(noMoreItemsText)) {
      return <Text style={[variantStyles.text, style]} text={noMoreItemsText.toString()}/>
    }
    return noMoreItemsText
  }
  return null
}
