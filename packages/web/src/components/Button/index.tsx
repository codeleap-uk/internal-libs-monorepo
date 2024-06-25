import React from 'react'
import { TypeGuards, StylesOf } from '@codeleap/common'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { Icon } from '../Icon'
import { ActivityIndicator } from '../ActivityIndicator'
import { ButtonParts } from './styles'
import { ButtonProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, mergeStyles, StyledComponentProps } from '@codeleap/styles'

export * from './styles'
export * from './types'

export const Button = (buttonProps: ButtonProps) => {
  const allProps = {
    ...Button.defaultProps,
    ...buttonProps,
  }

  const {
    children,
    icon,
    text,
    loading,
    loadingShowText,
    onPress,
    disabled,
    rightIcon,
    selected,
    loaderProps,
    debugName,
    style,
    ...props
  } = allProps

  const styles = useStylesFor(Button.styleRegistryName, style)

  const getStyles = (key: ButtonParts, partialStyle = null) => mergeStyles([
    styles?.[key],
    disabled ? styles?.[key + ':disabled'] : null,
    selected ? styles?.[key + ':selected'] : null,
    partialStyle,
  ])

  const iconStyles = getStyles('icon')

  const componentStyles: StylesOf<ButtonParts> = {
    wrapper: getStyles('wrapper'),
    text: getStyles('text'),
    loaderWrapper: getStyles('loaderWrapper'),
    leftIcon: getStyles('leftIcon', iconStyles),
    rightIcon: getStyles('rightIcon', iconStyles),
  }

  // TODO - This is a hack to hide the icon with display: none
  const isLeftIconHide = componentStyles?.leftIcon?.display === 'none'

  const shouldRenderLeftIcon = !loading && !isLeftIconHide && !!icon

  const _hideTextOnLoading = !loadingShowText && loading

  return (
    <Touchable
      component='button'
      debugComponent='Button'
      disabled={disabled}
      onPress={onPress}
      debugName={debugName}
      {...props}
      style={componentStyles.wrapper}
    >
      {shouldRenderLeftIcon ? <Icon debugName={debugName} name={icon} style={componentStyles.leftIcon} /> : null}
      {TypeGuards.isString(text) && !_hideTextOnLoading ? <Text debugName={debugName} text={text} style={componentStyles.text} /> : null}

      {children}

      {loading ? <ActivityIndicator debugName={debugName} {...loaderProps} style={componentStyles.loaderWrapper} /> : null}
      {!!rightIcon ? <Icon debugName={debugName} name={rightIcon} style={componentStyles.rightIcon} /> : null}
    </Touchable>
  )
}

Button.styleRegistryName = 'Button'
Button.elements = ['wrapper', 'text', 'icon', 'leftIcon', 'rightIcon', `loader`]
Button.rootElement = 'wrapper'

Button.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Button as (props: StyledComponentProps<ButtonProps, typeof styles>) => IJSX
}

Button.defaultProps = {
  debounce: 600,
  loadingShowText: false,
} as Partial<ButtonProps>

WebStyleRegistry.registerComponent(Button)
