import {
  ComponentVariants,
  IconPlaceholder,
  TypeGuards,
  matchInitialToColor,
  useDefaultComponentStyle,
  useMemo,
  getNestedStylesByKey,
} from '@codeleap/common'
import React from 'react'
// import { StyleSheet } from 'react-native'
import { StylesOf } from '../../types'
import { AvatarComposition, AvatarPresets } from './styles'
import { Image, ImageProps } from '../Image'
import { Touchable } from '../Touchable'
import { Text } from '../Text'
import { View, ViewProps } from '../View'
import { Icon } from '../Icon'
import { Badge, BadgeComponentProps } from '../Badge'

export type AvatarProps = ComponentVariants<typeof AvatarPresets> & {
  styles?: StylesOf<AvatarComposition>
  image?: ImageProps['source']
  name?: string | string[]
  debugName: string
  firstNameOnly?: boolean
  text?: string
  description?: string
  icon?: IconPlaceholder
  badgeIcon?: IconPlaceholder
  style?: ViewProps['style']
  onPress?: () => void
  noFeedback?: boolean
} & BadgeComponentProps

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
    badgeIcon,
    text,
    description,
    onPress,
    noFeedback,
    badge = false,
    badgeProps = {},
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

  const hasBackgroundColor = !!variantStyles?.touchable?.backgroundColor

  // const badgeStyles = getNestedStylesByKey('badge', variantStyles)

  return (
    <View style={[variantStyles.wrapper, style]} {...viewProps}>
      <Touchable
        debugName={'Avatar ' + debugName}
        onPress={() => onPress?.()}
        style={[
          variantStyles.touchable,
          !hasBackgroundColor && {
            backgroundColor: randomColor,
          },
        ]}
        noFeedback={noFeedback || !onPress}
      >
        {renderContent()}

        {!!description && (
          <View style={variantStyles.descriptionOverlay}>
            <Text text={description} style={variantStyles.description} />
          </View>
        )}

        {/* <Badge badge={badge} style={badgeStyles} {...badgeProps} /> */}
      </Touchable>

      {badgeIcon && (
        <Touchable
          debugName={`${debugName} badge`}
          style={variantStyles.badgeIconWrapper}
          onPress={() => onPress?.()}
          noFeedback
        >
          <Icon name={badgeIcon} style={variantStyles.badgeIcon} />
        </Touchable>
      )}
    </View>
  )
}

export * from './styles'
