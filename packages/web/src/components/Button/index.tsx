import React from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  AnyFunction,
  TypeGuards,
  IconPlaceholder,
  StylesOf,
} from '@codeleap/common'
import { Text } from '../Text'
import { Touchable, TouchableProps } from '../Touchable'
import { Icon } from '../Icon'
import { ActivityIndicator, ActivityIndicatorProps } from '../ActivityIndicator'
import { ButtonComposition, ButtonPresets, ButtonParts } from './styles'
import { ComponentCommonProps } from '../../types'

/** * Button */
export type ButtonProps = 
  ComponentVariants<typeof ButtonPresets> &
  Partial<Omit<TouchableProps<'button'>, 'variants' | 'styles'>> &
  ComponentCommonProps & {
    /** prop */
    text?: string
    /** prop */
    rightIcon?: IconPlaceholder
    /** prop */
    icon?: IconPlaceholder
    /** prop */
    onPress?: AnyFunction
    styles?: StylesOf<ButtonComposition>
    style?: React.CSSProperties
    /** prop */
    loading?: boolean
    loadingShowText?: boolean
    /** prop */
    debugName: string
    /** prop */
    debounce?: number
    /** prop */
    selected?: boolean
    children?: React.ReactNode | ((props: Partial<Omit<ButtonProps, 'children'>>) => JSX.Element)
    loaderProps?: Partial<ActivityIndicatorProps>
  }

const defaultProps: Partial<ButtonProps> = {
  debounce: 600,
  loadingShowText: false,
}

export const Button = (buttonProps: ButtonProps) => {
  const allProps = {
    ...Button.defaultProps,
    ...buttonProps
  }

  const {
    variants = [],
    responsiveVariants = {},
    styles = {},
    children,
    icon,
    text,
    loading,
    loadingShowText,
    onPress,
    disabled,
    rightIcon,
    selected,
    loaderProps = {},
    debugName,
    style = {},
    ...props
  } = allProps

  const variantStyles = useDefaultComponentStyle<'u:Button', typeof ButtonPresets>('u:Button', {
    responsiveVariants,
    variants,
    styles,
    rootElement: 'wrapper',
  })

  const getStyles = (key: ButtonParts) => ({
    ...variantStyles?.[key],
    ...(disabled ? variantStyles?.[key + ':disabled'] : {}),
    ...(selected ? variantStyles?.[key + ':selected'] : {})
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
      ...getStyles('rightIcon')
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

Button.defaultProps = defaultProps

export * from './styles'
