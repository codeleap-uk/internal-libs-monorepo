import React from 'react'
import {
  ComponentVariants,
  ContentViewStyles,
  useDefaultComponentStyle,
  ViewComposition,
} from '@codeleap/common'
import { ViewProps, View } from './View'
import { Text } from './Text'
import { StylesOf } from '../types/utility'
import { ActivityIndicator } from './ActivityIndicator'
import { StyleSheet } from 'react-native'

export type ContentViewProps = Omit<
  ViewProps,
  'variants' | 'responsiveVariants'
> & {
  placeholderMsg: string
  loading?: boolean
  styles?: StylesOf<ViewComposition>
} & ComponentVariants<typeof ContentViewStyles>

const WrapContent = ({ children, ...props }) => (
  <View {...props}>{children}</View>
)

export const ContentView: React.FC<ContentViewProps> = (rawProps) => {
  const { children, placeholderMsg, loading, variants, styles, ...props } =
    rawProps

  const variantStyle = useDefaultComponentStyle('ContentView', {
    variants,
    transform: StyleSheet.flatten,
    styles,
  })

  if (loading) {
    return (
      <WrapContent {...props} style={variantStyle.wrapper}>
        <ActivityIndicator styles={{ wrapper: variantStyle.loader }} />
      </WrapContent>
    )
  }
  const hasChildren = Object.keys(children || {}).length > 0
  if (hasChildren) {
    return (
      <WrapContent {...props} style={variantStyle.wrapper}>
        {children}
      </WrapContent>
    )
  }

  return (
    <WrapContent {...props} style={styles}>
      <Text text={placeholderMsg} />
    </WrapContent>
  )
}
