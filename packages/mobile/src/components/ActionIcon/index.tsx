import React from 'react'
import { AnyRecord, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { Badge } from '../Badge'
import { Icon } from '../Icon'
import { Touchable } from '../Touchable'
import { ActionIconProps } from './types'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const ActionIcon = (props: ActionIconProps) => {
  const {
    name,
    icon,
    iconProps,
    children,
    badge,
    badgeProps = {},
    style,
    ...touchableProps
  } = {
    ...ActionIcon.defaultProps,
    ...props,
  }

  const styles = useStylesFor(ActionIcon.styleRegistryName, style)

  const compositionStyles = useCompositionStyles(['badge', 'touchable'], styles)

  return (
    <Touchable style={compositionStyles?.touchable} {...touchableProps}>
      <Icon
        name={icon ?? name}
        style={[
          styles.icon,
          touchableProps?.disabled && styles['icon:disabled'],
        ]}
        {...iconProps}
      />

      {children}

      <Badge badge={badge} style={compositionStyles?.badge} {...badgeProps} />
    </Touchable>
  )
}

ActionIcon.styleRegistryName = 'ActionIcon'
ActionIcon.elements = ['icon', 'touchable', 'badge']
ActionIcon.rootElement = 'touchableWrapper'

ActionIcon.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ActionIcon as (props: StyledComponentProps<ActionIconProps, typeof styles>) => IJSX
}

ActionIcon.defaultProps = {
  hitSlop: 10,
  badge: false,
}

MobileStyleRegistry.registerComponent(ActionIcon)
