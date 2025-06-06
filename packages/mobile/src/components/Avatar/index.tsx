import React from 'react'
import { TypeGuards } from '@codeleap/types'
import { useMemo } from '@codeleap/hooks'
import { matchInitialToColor } from '@codeleap/utils'
import { Image } from '../Image'
import { Touchable } from '../Touchable'
import { Text } from '../Text'
import { View, ViewProps } from '../View'
import { Icon } from '../Icon'
import { Badge } from '../Badge'
import { AvatarProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { AnyRecord, useNestedStylesByKey, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const Avatar = (props: AvatarProps) => {
  const {
    debugName,
    name = '',
    firstNameOnly,
    image,
    icon,
    badgeIcon,
    text,
    description,
    onPress,
    noFeedback,
    badge,
    badgeProps = {},
    imageProps,
    badgeIconTouchProps,
    style,
    ...viewProps
  } = {
    ...Avatar.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Avatar.styleRegistryName, style)

  const hasImage = !!image

  const { initials, randomColor } = useMemo(() => {
    const [first = '', last = ''] = TypeGuards.isString(name) ? name.split(' ') : name
    const initials = [first[0]]
    
    if (!firstNameOnly) initials.push(last[0])

    return {
      initials: initials?.join(' '),
      randomColor: matchInitialToColor(first[0]),
    }
  }, [name, firstNameOnly])

  const renderContent = () => {
    if (hasImage) return <Image source={image} {...imageProps} style={styles.image} />
    if (icon) return <Icon name={icon} style={styles.icon} />
    return <Text text={text || initials} style={styles.initials} />
  }

  // @ts-expect-error icss type
  const hasBackgroundColor = !!styles?.touchable?.backgroundColor

  const badgeStyles = useNestedStylesByKey('badge', styles)

  return (
    <View {...viewProps as ViewProps} style={styles.wrapper}>
      <Touchable
        debugName={'Avatar:' + debugName}
        onPress={() => onPress?.()}
        style={[
          styles.touchable,
          !hasBackgroundColor && { backgroundColor: randomColor },
        ]}
        noFeedback={noFeedback || !onPress}
      >
        {renderContent()}

        {!!description ? (
          <View style={styles.descriptionOverlay}>
            <Text text={description} style={styles.description} />
          </View>
        ) : null}

        <Badge badge={badge} {...badgeProps} style={badgeStyles} />
      </Touchable>

      {badgeIcon ? (
        <Touchable
          onPress={() => onPress?.()}
          noFeedback
          {...badgeIconTouchProps}
          debugName={`AvatarBadge:${debugName}`}
          style={styles.badgeIconWrapper}
        >
          <Icon name={badgeIcon} style={styles.badgeIcon} />
        </Touchable>
      ) : null}
    </View>
  )
}

Avatar.styleRegistryName = 'Avatar'
Avatar.elements = ['wrapper', 'touchable', 'initials', 'image', 'icon', 'description', 'badge']
Avatar.rootElement = 'wrapper'

Avatar.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Avatar as (props: StyledComponentProps<AvatarProps, typeof styles>) => IJSX
}

Avatar.defaultProps = {
  badge: false,
  firstNameOnly: true,
} as AvatarProps

MobileStyleRegistry.registerComponent(Avatar)
