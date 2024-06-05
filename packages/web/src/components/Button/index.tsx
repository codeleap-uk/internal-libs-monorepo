import React from 'react'
import {
  TypeGuards,
  StylesOf,
} from '@codeleap/common'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { Icon } from '../Icon'
import { ActivityIndicator } from '../ActivityIndicator'
import { ButtonParts } from './styles'
import { ButtonProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'

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

  const getStyles = (key: ButtonParts) => ({
    ...styles?.[key],
    ...(disabled ? styles?.[key + ':disabled'] : {}),
    ...(selected ? styles?.[key + ':selected'] : {}),
  })

  const iconStyles = getStyles('icon')

  const _styles: StylesOf<ButtonParts> = {
    wrapper: getStyles('wrapper'),
    text: getStyles('text'),
    loaderWrapper: getStyles('loaderWrapper'),
    leftIcon: {
      ...iconStyles,
      ...getStyles('leftIcon'),
    },
    rightIcon: {
      ...iconStyles,
      ...getStyles('rightIcon'),
    },
  }

  const childrenContent = TypeGuards.isFunction(children)
    // @ts-ignore
    ? children(allProps)
    : children

  // TODO - This is a hack to hide the icon with display: none
  const isLeftIconHide = _styles?.leftIcon?.display === 'none'

  const shouldRenderLeftIcon = !loading && !isLeftIconHide

  const _hideTextOnLoading = !loadingShowText && loading

  return (
    <Touchable
      css={[_styles.wrapper, style]}
      component='button'
      debugComponent='Button'
      disabled={disabled}
      onPress={onPress}
      debugName={debugName}
      {...props}
    >
      {shouldRenderLeftIcon && <Icon debugName={debugName} name={icon} style={_styles.leftIcon} />}
      {TypeGuards.isString(text) && !_hideTextOnLoading ? <Text debugName={debugName} text={text} css={[_styles.text]} /> : null }

      {childrenContent}

      <Icon debugName={debugName} name={rightIcon} style={_styles.rightIcon}/>
      {loading && (
        <ActivityIndicator debugName={debugName} style={_styles.loaderWrapper} {...loaderProps} />
      )}
    </Touchable>
  )
}

Button.styleRegistryName = 'Button'

Button.elements = [
  'wrapper',
  'text',
  'icon',
  'leftIcon',
  'rightIcon',
  `loader`,
]

Button.rootElement = 'wrapper'

Button.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Button as (props: StyledComponentProps<ButtonProps, typeof styles>) => IJSX
}

Button.defaultProps = {
  debounce: 600,
  loadingShowText: false,
} as Partial<ButtonProps>

WebStyleRegistry.registerComponent(Button)

export * from './styles'
export * from './types'
