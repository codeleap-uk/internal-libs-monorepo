import React from 'react'
import {
  assignTextStyle,
  ComponentVariants,
  createDefaultVariantFactory,
  getNestedStylesByKey,
  includePresets,
  TypeGuards,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { StylesOf } from '../../types'
import { ActivityIndicator, ActivityIndicatorComposition } from '../ActivityIndicator'
import { Text } from '../Text'
import { View } from '../View'

export type PaginationIndicatorComposition = 'text' | `loader${Capitalize<ActivityIndicatorComposition>}` | 'wrapper'

const createPaginationIndicatorStyle = createDefaultVariantFactory<PaginationIndicatorComposition>()

const presets = includePresets((style) => createPaginationIndicatorStyle(() => ({ loaderWrapper: style, text: style })))

export const PaginationIndicatorStyles = {
  ...presets,
  default: createPaginationIndicatorStyle((theme) => {
    return {
      wrapper: {
        ...theme.presets.fullWidth,
        ...theme.presets.center,
      },
      loaderWrapper: {
        ...theme.presets.center,
        ...theme.spacing.marginVertical(3),
      },
      text: {
        ...assignTextStyle('h4')(theme).text,
        ...theme.presets.textCenter,
        ...theme.spacing.marginVertical(3),
        ...theme.presets.fullWidth,
      },
    }
  }),
}

export type PaginationIndicatorProps = {
  isFetching?: boolean
  noMoreItemsText: React.ReactChild
  hasMore?: boolean
  activityIndicator?: JSX.Element
  styles?: StylesOf<PaginationIndicatorComposition>
  style?: React.CSSProperties
} & ComponentVariants<typeof PaginationIndicatorStyles>

export const PaginationIndicator = (props: PaginationIndicatorProps) => {
  const { 
    hasMore, 
    isFetching, 
    noMoreItemsText, 
    style, 
    activityIndicator, 
    styles = {}, 
    responsiveVariants = {},
    variants = [] 
  } = props

  const variantStyles = useDefaultComponentStyle<
    'u:PaginationIndicator',
    typeof PaginationIndicatorStyles
    >('u:PaginationIndicator', {
      variants,
      responsiveVariants,
      styles,
    })

  const loaderStyles = getNestedStylesByKey('loader', variantStyles)

  if (isFetching) {
    return activityIndicator || <View style={variantStyles.wrapper}><ActivityIndicator style={style} styles={loaderStyles}/></View>
  }
  if (!hasMore) {
    if (TypeGuards.isString(noMoreItemsText) || TypeGuards.isNumber(noMoreItemsText)) {
      return <Text css={[variantStyles.text, style]} text={noMoreItemsText.toString()}/>
    }
    return noMoreItemsText
  }
  return null
}
