import React, { useMemo } from 'react'
import { Icon } from '../Icon'
import { View } from '../View'
import { Text } from '../Text'
import { ActivityIndicator } from '../ActivityIndicator'
import {
  ComponentVariants,

  getNestedStylesByKey,
  IconPlaceholder,
  useDefaultComponentStyle,
} from '@codeleap/common'

import {
  EmptyPlaceholderComposition,
  EmptyPlaceholderStyles,
} from './styles'

import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types'

export * from './styles'

export type EmptyPlaceholderProps = {
  itemName?: string
  title?: React.ReactElement
  loading?: boolean
  styles?: StylesOf<EmptyPlaceholderComposition>
  variants?: ComponentVariants<typeof EmptyPlaceholderStyles>['variants']
  emptyIconName?: IconPlaceholder
}

export const EmptyPlaceholder:React.FC<EmptyPlaceholderProps> = (props: EmptyPlaceholderProps) => {
  const { itemName, title, loading, styles = {}, variants = [], emptyIconName = 'search' } = props
  const emptyText = title || (itemName && `No ${itemName} found.`) || 'No items.'

  const componentStyles = useDefaultComponentStyle('EmptyPlaceholder', {
    variants,
    transform: StyleSheet.flatten,
    styles,
  })

  const activityIndicatorStyles = useMemo(() => getNestedStylesByKey('loader', componentStyles)
    , [componentStyles])

  if (loading) {
    return (
      <View style={[componentStyles.wrapper, componentStyles['wrapper:loading']]} >
        <ActivityIndicator styles={activityIndicatorStyles}/>
      </View>
    )
  }

  return (
    <View style={componentStyles.wrapper}>
      <Icon name={emptyIconName as IconPlaceholder} style={componentStyles.icon}/>
      <Text text={emptyText} style={componentStyles.text}/>
    </View>
  )
}
