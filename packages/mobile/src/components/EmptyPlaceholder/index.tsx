import React, { useMemo } from 'react'
import { Icon } from '../Icon'
import { View } from '../View'
import { Text } from '../Text'
import { ActivityIndicator, ActivityIndicatorComposition } from '../ActivityIndicator'
import {
  ComponentVariants,

  getNestedStylesByKey,
  IconPlaceholder,
  useDefaultComponentStyle,
} from '@codeleap/common'

import {
  EmptyPlaceholderComposition,
  EmptyPlaceholderPresets,
} from './styles'

import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types'
import { Image, ImageProps } from '../Image'

export * from './styles'

export type EmptyPlaceholderProps = {
  itemName?: string

  title?: React.ReactElement | string
  description?: React.ReactElement | string
  image?: ImageProps['source']
  icon?: IconPlaceholder

  loading?: boolean

  styles?: StylesOf<EmptyPlaceholderComposition>
  variants?: ComponentVariants<typeof EmptyPlaceholderPresets>['variants']

  renderEmpty?: (props: {
    emptyText:string | React.ReactElement
    emptyIconName?: IconPlaceholder
    styles: StylesOf<EmptyPlaceholderComposition> & {activityIndicatorStyles: StylesOf<ActivityIndicatorComposition>}
  }) => React.ReactElement
}

export const EmptyPlaceholder:React.FC<EmptyPlaceholderProps> = (props: EmptyPlaceholderProps) => {
  const {
    itemName,
    title,
    loading,
    description,
    image,
    styles = {},
    variants = [],
    icon = null,
    renderEmpty,
  } = props
  const emptyText = title || (itemName && `No ${itemName} found.`) || 'No items.'

  const componentStyles = useDefaultComponentStyle<'u:EmptyPlaceholder', typeof EmptyPlaceholderPresets>('u:EmptyPlaceholder', {
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

  if (renderEmpty) {
    return (
      <View style={componentStyles.wrapper}>
        {renderEmpty({
          emptyText,
          emptyIconName: icon as IconPlaceholder,
          styles: {
            ...componentStyles,
            activityIndicatorStyles,
          },
        })}
      </View>
    )
  }

  let _image = null

  if (icon) {
    _image = <Icon name={icon} style={componentStyles.icon}/>
  } else if (image) {
    _image = <Image source={image} style={[componentStyles.image]}/>
  }

  return (
    <View style={componentStyles.wrapper}>
      {React.isValidElement(_image) ? (
        <View style={componentStyles.imageWrapper}>
          {_image}
        </View>
      ) : null}

      {React.isValidElement(emptyText) ? emptyText : <Text text={emptyText} style={componentStyles.title}/> }
      {React.isValidElement(description) ? description : <Text text={description} style={componentStyles.description}/> }
    </View>
  )
}
