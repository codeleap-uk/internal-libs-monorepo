import React from 'react'
import { AnyRecord, getNestedStylesByKey, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { Badge } from '../Badge'
import { Icon } from '../Icon'
import { Touchable } from '../Touchable'
import { ActionIconProps } from './types'

export * from './styles'
export * from './types'

export const ActionIcon = (props: ActionIconProps) => {
  const {
    name,
    icon,
    iconProps,
    children,
    badge = false,
    badgeProps = {},
    style,
    ...touchableProps
  } = {
    ...ActionIcon.defaultProps,
    ...props,
  }

  const styles = MobileStyleRegistry.current.styleFor(ActionIcon.styleRegistryName, style)

  const touchableStyles = getNestedStylesByKey('touchable', styles)
  const badgeStyles = getNestedStylesByKey('badge', styles)

  return (
    <Touchable style={touchableStyles} {...touchableProps}>
      <Icon
        name={icon ?? name}
        style={[
          styles.icon,
          touchableProps?.disabled && styles['icon:disabled'],
        ]}
        {...iconProps}
      />

      {children}

      <Badge badge={badge} style={badgeStyles} {...badgeProps} />
    </Touchable>
  )
}

ActionIcon.styleRegistryName = 'ActionIcon'
ActionIcon.elements = ['icon', 'touchable', 'badge']
ActionIcon.rootElement = 'icon'

ActionIcon.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ActionIcon as (props: StyledComponentProps<ActionIconProps, typeof styles>) => IJSX
}

ActionIcon.defaultProps = {
  hitSlop: 10,
}

MobileStyleRegistry.registerComponent(ActionIcon)
