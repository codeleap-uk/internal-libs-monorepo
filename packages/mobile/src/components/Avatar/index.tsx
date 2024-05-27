import React from 'react'
import { TypeGuards, matchInitialToColor, useMemo } from '@codeleap/common'
import { Image } from '../Image'
import { Touchable } from '../Touchable'
import { Text } from '../Text'
import { View } from '../View'
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
    firstNameOnly = true,
    image,
    icon,
    badgeIcon,
    text,
    description,
    onPress,
    noFeedback,
    badge = false,
    badgeProps = {},
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
    if (hasImage) return <Image source={image} style={styles.image} />
    if (icon) return <Icon name={icon} style={styles.icon} />
    return <Text text={text || initials} style={styles.initials} />
  }

  // @ts-expect-error
  const hasBackgroundColor = !!styles?.touchable?.backgroundColor

  const badgeStyles = useNestedStylesByKey('badge', styles)

  return (
    <View style={styles.wrapper} {...viewProps as any}>
      <Touchable
        debugName={'Avatar:' + debugName}
        onPress={() => onPress?.()}
        style={[
          styles.touchable,
          !hasBackgroundColor && {
            backgroundColor: randomColor,
          },
        ]}
        noFeedback={noFeedback || !onPress}
      >
        {renderContent()}

        {!!description ? (
          <View style={styles.descriptionOverlay}>
            <Text text={description} style={styles.description} />
          </View>
        ) : null}

        <Badge badge={badge} style={badgeStyles} {...badgeProps} />
      </Touchable>

      {badgeIcon ? (
        <Touchable
          debugName={`AvatarBadge:${debugName}`}
          style={styles.badgeIconWrapper}
          onPress={() => onPress?.()}
          noFeedback
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

Avatar.defaultProps = {}

MobileStyleRegistry.registerComponent(Avatar)
