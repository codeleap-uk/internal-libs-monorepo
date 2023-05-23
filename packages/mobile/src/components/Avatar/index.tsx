import {
  ComponentVariants,
  IconPlaceholder,
  TypeGuards,
  matchInitialToColor,
  useDefaultComponentStyle,
  useMemo,
} from '@codeleap/common'
import React from 'react'
import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types'
import { AvatarComposition, AvatarPresets } from './styles'
import { Image, ImageProps } from '../Image'
import { Touchable } from '../Touchable'
import { Text } from '../Text'
import { View, ViewProps } from '../View'
import { Icon } from '../Icon'

export type AvatarProps = ComponentVariants<typeof AvatarPresets> & {
  styles?: StylesOf<AvatarComposition>
  image?: ImageProps['source']
  name?: string | string[]
  debugName: string
  firstNameOnly?: boolean
  text?: string
  description?: string
  icon?: IconPlaceholder
  badge?: IconPlaceholder
  style?: ViewProps['style']
  onPress?: () => void
  noFeedback?: boolean
}

export const Avatar: React.FC<AvatarProps> = (props) => {
  const {
    debugName,
    name = '',
    firstNameOnly = true,
    image,
    variants = [],
    styles,
    style,
    icon,
    badge,
    text,
    description,
    onPress,
    noFeedback,
    ...viewProps
  } = props

  const variantStyles = useDefaultComponentStyle('u:Avatar', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })

  const hasImage = !!image

  const { initials, randomColor } = useMemo(() => {
    const [first = '', last = ''] = TypeGuards.isString(name)
      ? name.split(' ')
      : name
    const initials = [first[0]]
    if (!firstNameOnly) {
      initials.push(last[0])
    }
    return {
      initials: initials.join(' '),
      randomColor: matchInitialToColor(first[0]),
    }
  }, [name, firstNameOnly])

  const renderContent = () => {
    if (hasImage) return <Image source={image} style={variantStyles.image} />
    if (icon) return <Icon name={icon} style={variantStyles.icon} />
    return <Text text={text || initials} style={variantStyles.initials} />
  }

  return (
    <View style={[variantStyles.wrapper, style]} {...viewProps}>
      <Touchable
        debugName={'Avatar ' + debugName}
        onPress={() => onPress?.()}
        style={[
          {
            backgroundColor: hasImage || icon ? '#F2F2F2' : randomColor,
          },
          variantStyles.touchable,
        ]}
        noFeedback={noFeedback || !onPress}
      >
        {renderContent()}

        {!!description && (
          <View style={variantStyles.descriptionOverlay}>
            <Text text={description} style={variantStyles.description} />
          </View>
        )}
      </Touchable>

      {badge && (
        <View style={variantStyles.badgeWrapper}>
          <Icon name={badge} style={variantStyles.badge} />
        </View>
      )}
    </View>
  )
}

export * from './styles'
