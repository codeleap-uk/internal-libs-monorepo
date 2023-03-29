import React from 'react'
import {

  ComponentVariants,
  useDefaultComponentStyle,

} from '@codeleap/common'
import {
  ContentViewPresets,
} from './styles'
import { ViewProps, View, ViewComposition } from '../View'
import { Text } from '../Text'
import { StylesOf } from '../../types'
import { ActivityIndicator } from '../ActivityIndicator'
import { StyleSheet } from 'react-native'

export * from './styles'

export type ContentViewProps = Omit<
  ViewProps,
  'variants' | 'responsiveVariants'
> & {
  message?: string
  loading?: boolean
  styles?: StylesOf<ViewComposition>
} & ComponentVariants<typeof ContentViewPresets>

const WrapContent = ({ children, ...props }) => (
  <View {...props}>{children}</View>
)

export const ContentView: React.FC<ContentViewProps> = (rawProps) => {
  const { children, message, loading, variants, styles, ...props } =
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
      <Text text={message} />
    </WrapContent>
  )
}
