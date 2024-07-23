import { TypeGuards } from '@codeleap/common'
import { Icon } from '../Icon'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { ActionIconParts } from './styles'
import { ActionIconProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, mergeStyles, StyledComponentProps } from '@codeleap/styles'

export * from './styles'
export * from './types'

export const ActionIcon = (props: ActionIconProps) => {
  const {
    icon,
    name,
    iconProps,
    onPress,
    style,
    children,
    disabled,
    debugName,
    ...touchableProps
  } = {
    ...ActionIcon.defaultProps,
    ...props,
  }

  const styles = useStylesFor(ActionIcon.styleRegistryName, style)

  const isPressable = TypeGuards.isFunction(onPress) && !disabled

  const WrapperComponent = isPressable ? Touchable : View

  const handlePress = (e) => {
    if (!isPressable) return

    const pressed = e?.type === 'click' || e?.keyCode === 13 || e?.key === 'Enter'

    if (pressed) {
      onPress?.(e)
    }
  }

  const getStyles = (key: ActionIconParts) => mergeStyles([
    styles[key],
    disabled && styles[`${key}:disabled`],
    isPressable && styles[`${key}:pressable`],
  ])

  const wrapperProps = isPressable ? {
    onPress: () => handlePress({ type: 'click' }),
    onKeyDown: handlePress,
  } : {}

  const wrapperStyles = getStyles('touchableWrapper')
  const iconStyles = getStyles('icon')

  return (
    // @ts-expect-error
    <WrapperComponent
      disabled={disabled}
      debugName={debugName}
      {...wrapperProps}
      {...touchableProps}
      style={wrapperStyles}
    >
      <Icon
        debugName={debugName}
        name={icon ?? name}
        {...iconProps}
        style={iconStyles}
      />
      {children}
    </WrapperComponent>
  )
}

ActionIcon.styleRegistryName = 'ActionIcon'
ActionIcon.elements = ['touchable', 'icon']
ActionIcon.rootElement = 'touchableWrapper'

ActionIcon.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ActionIcon as (props: StyledComponentProps<ActionIconProps, typeof styles>) => IJSX
}

ActionIcon.defaultProps = {
  disabled: false,
  tabIndex: 0,
} as Partial<ActionIconProps>

WebStyleRegistry.registerComponent(ActionIcon)
