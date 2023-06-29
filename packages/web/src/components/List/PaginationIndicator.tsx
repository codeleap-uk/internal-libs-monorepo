import React from 'react'
import {
  assignTextStyle,
  ComponentVariants,
  createDefaultVariantFactory,
  getNestedStylesByKey,
  includePresets,
  StylesOf,
  TypeGuards,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { ActivityIndicator, ActivityIndicatorComposition, ActivityIndicatorProps } from '../ActivityIndicator'
import { Text, TextProps } from '../Text'
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
  indicatorProps?: Partial<ActivityIndicatorProps>
  textProps?: Partial<TextProps<'p'>>
} & ComponentVariants<typeof PaginationIndicatorStyles>

const defaultProps: Partial<PaginationIndicatorProps> = {}

export const PaginationIndicator = (props: PaginationIndicatorProps) => {
  const allProps = {
    ...PaginationIndicator.defaultProps,
    ...props,
  }

  const { 
    hasMore, 
    isFetching, 
    noMoreItemsText, 
    style, 
    activityIndicator, 
    styles = {}, 
    responsiveVariants = {},
    variants = [],
    indicatorProps = {},
  } = allProps

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
    return activityIndicator || <View css={[variantStyles.wrapper, style]}><ActivityIndicator {...indicatorProps} styles={loaderStyles}/></View>
  }
  
  if (!hasMore) {
    if (TypeGuards.isString(noMoreItemsText) || TypeGuards.isNumber(noMoreItemsText)) {
      return <Text css={[variantStyles.text, style]} text={noMoreItemsText.toString()}/>
    }
    return noMoreItemsText
  }

  return null
}

PaginationIndicator.defaultProps = defaultProps
