import { TypeGuards } from '@codeleap/common'
import { Icon } from '../Icon'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { ActionIconParts } from './styles'
import { ActionIconProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'

export const ActionIcon = (props: ActionIconProps) => {

  const {
    icon,
    name,
    iconProps,
    onPress,
    style = {},
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

  const WrapperComponent: any = isPressable ? Touchable : View

  const handlePress = (e) => {
    if (!isPressable) return
    if (onPress && (e?.type === 'click' || e?.keyCode === 13 || e?.key === 'Enter')) {
      onPress?.()
    }
  }

  const getStyles = (key: ActionIconParts) => ({
    ...styles[key],
    ...(disabled ? styles[`${key}:disabled`] : {}),
    ...(isPressable ? styles[`${key}:pressable`] : {}),
  })

  return (
    <WrapperComponent
      disabled={disabled}
      debugName={debugName}
      {
        ...(isPressable && {
          onPress: () => handlePress({ type: 'click' }),
          onKeyDown: handlePress,
        })
      }
      {...touchableProps}
      stlyle={getStyles('touchableWrapper')}
    >
      <Icon
        debugName={debugName}
        name={icon ?? name}
        {...iconProps}
        style={getStyles('icon')}
      />
      {children}
    </WrapperComponent>
  )
}

ActionIcon.styleRegistryName = 'ActionIcon'

ActionIcon.elements = ['icon', 'touchable']

ActionIcon.rootElement = 'wrapper'

ActionIcon.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return ActionIcon as (props: StyledComponentProps<ActionIconProps, typeof styles>) => IJSX
}

ActionIcon.defaultProps = {
  disabled: false,
  tabIndex: 0,
} as Partial<ActionIconProps>

WebStyleRegistry.registerComponent(ActionIcon)

export * from './styles'
export * from './types'
