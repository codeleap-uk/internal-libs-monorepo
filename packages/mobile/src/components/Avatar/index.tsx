import React, { useMemo } from 'react'
import { View, ViewProps } from '../View'
import { Touchable } from '../Touchable'
import { Icon } from '../Icon'
import { AvatarProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { AvatarContext } from './context'
import { AvatarContent } from './components/AvatarContent'
import { AvatarBadge } from './components/AvatarBadge'
import { useStylesFor } from '../../hooks'
import { matchInitialToColor } from '@codeleap/utils'
import { AvatarDescription } from './components/Avatardescription'

export * from './styles'
export * from './types'

export const Avatar = (props: AvatarProps) => {
  const {
    debugName,
    name = '',
    firstNameOnly,
    onPress,
    noFeedback,
    badgeIcon,
    badgeIconTouchProps,
    style,
    ...contextValue
  } = {
    ...Avatar.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Avatar.styleRegistryName, style)

  const { randomColor } = useMemo(() => {
    const [first = ''] = typeof name === 'string' ? name.split(' ') : Array.isArray(name) ? name : ['']
    return { randomColor: matchInitialToColor(first[0]) }
  }, [name])

  // @ts-expect-error icss type
  const hasBackgroundColor = !!styles?.touchable?.backgroundColor

  return (
    <AvatarContext.Provider value={{ debugName, name: name || '', firstNameOnly, ...contextValue, styles }}>
      <View {...(contextValue as ViewProps)} style={styles.wrapper}>
        <Touchable
          debugName={'Avatar:' + debugName}
          onPress={() => onPress?.()}
          noFeedback={noFeedback || !onPress}
          style={[
            styles.touchable,
            !hasBackgroundColor && { backgroundColor: randomColor },
          ]}
        >
          <AvatarContent />
          <AvatarDescription />
          <AvatarBadge />
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
    </AvatarContext.Provider>
  )
}

Avatar.styleRegistryName = 'Avatar'
Avatar.elements = ['wrapper', 'touchable', 'initials', 'image', 'icon', 'description', 'badge']
Avatar.rootElement = 'wrapper'

Avatar.withVariantTypes = <S extends AnyRecord>(styles: S) => Avatar as (props: StyledComponentProps<AvatarProps, typeof styles>) => IJSX

Avatar.defaultProps = {
  badge: false,
  firstNameOnly: true,
} as AvatarProps

MobileStyleRegistry.registerComponent(Avatar)
