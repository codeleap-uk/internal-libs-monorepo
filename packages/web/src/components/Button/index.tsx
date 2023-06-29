import React from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  AnyFunction,
  TypeGuards,
  IconPlaceholder,
  StylesOf,
  getNestedStylesByKey
} from '@codeleap/common'
import { Text } from '../Text'
import { Touchable, TouchableProps } from '../Touchable'
import { Icon } from '../Icon'
import { ActivityIndicator } from '../ActivityIndicator'
import { ButtonComposition, ButtonPresets, ButtonParts } from './styles'

export type ButtonProps = ComponentVariants<typeof ButtonPresets> & {
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
  children?: React.ReactNode | ((props: Partial<ButtonProps>) => React.ReactNode)
} & Partial<TouchableProps<'button'>>

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
    ...props
  } = allProps

  const variantStyles = useDefaultComponentStyle<'u:Button', typeof ButtonPresets>('u:Button', {
    responsiveVariants,
    variants,
    styles,
    rootElement: 'wrapper',
  })

  const getStyles = (key:ButtonParts) => React.useCallback(() => ({
    ...variantStyles?.[key],
    ...(disabled ? variantStyles?.[key + ':disabled'] : {}),
    ...(selected ? variantStyles?.[key + ':selected'] : {})
  }), [variantStyles, disabled, selected])

  const iconStyles = getStyles('icon')

  const indicatorStyles = getNestedStylesByKey('loader', variantStyles)

  const _styles: StylesOf<ButtonParts> = {
    wrapper: getStyles('wrapper'),
    text: getStyles('text'),
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
  const isLeftIconVisible = !(_styles?.leftIcon?.display != 'none')

  const shouldRenderLeftIcon = !loading && isLeftIconVisible

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
      {loading && <ActivityIndicator styles={indicatorStyles} />}
    </Touchable>
  )
}

Button.defaultProps = defaultProps

export * from './styles'
