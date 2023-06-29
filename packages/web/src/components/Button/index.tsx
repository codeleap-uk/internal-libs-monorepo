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

export type ButtonProps = 
  ComponentVariants<typeof ButtonPresets> &
  Partial<Omit<TouchableProps<'button'>, 'variants' | 'styles'>> & {
    text?: string
    rightIcon?: IconPlaceholder
    icon?: IconPlaceholder
    onPress?: AnyFunction
    styles?: StylesOf<ButtonComposition>
    style?: React.CSSProperties
    loading?: boolean
    debugName: string
    debounce?: number
    selected?: boolean
    children?: React.ReactNode | ((props: Partial<Omit<ButtonProps, 'children'>>) => JSX.Element)
    loaderProps?: Partial<ActivityIndicatorProps>
  }

const defaultProps: Partial<ButtonProps> = {
  debounce: 600,
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
    style = {},
    children,
    icon,
    text,
    loading,
    onPress,
    disabled,
    rightIcon,
    selected,
    loaderProps = {},
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

  return (
    <Touchable
      css={_styles.wrapper}
      component='button'
      debugComponent='Button'
      disabled={disabled}
      onPress={onPress}
      {...props}
    >
      {shouldRenderLeftIcon && <Icon name={icon} style={_styles.leftIcon} />}
      {TypeGuards.isString(text) ? <Text text={text} css={[_styles.text]} /> : null }
      
      {childrenContent}

      <Icon name={rightIcon} style={_styles.rightIcon}/>
      {loading && (
        <ActivityIndicator style={_styles.loaderWrapper} {...loaderProps} />
      )}
    </Touchable>
  )
}

Button.defaultProps = defaultProps

export * from './styles'
