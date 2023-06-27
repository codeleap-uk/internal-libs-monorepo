/** @jsx jsx */
import { jsx } from '@emotion/react'

import {
  useDefaultComponentStyle,
  ButtonStyles,
  ComponentVariants,
  ButtonComposition,
  ButtonParts,
  optionalObject,
  AnyFunction,
  EnhancedTheme,
  ComponentStyleMap,
  CommonVariantObject,
  AppTheme,
  TypeGuards,
} from '@codeleap/common'
import React from 'react'
import { StylesOf } from '../../types/utility'
import { Text } from '../Text'
import { Touchable, TouchableProps } from '../Touchable'
import { Icon } from '../Icon'
import { IconPlaceholder, useNestedStylesByKey } from '@codeleap/common'
import { LoadingOverlay } from '../LoadingOverlay'
import { ActivityIndicator } from '../ActivityIndicator'

type ChildProps = {
  styles: StylesOf<ButtonParts>
  props: Omit<ButtonProps, 'children'>
}

const BUTTON_DEBOUNCE_TIME = 600

export type ButtonProps =
  ComponentVariants<typeof ButtonStyles> & {
    text?: string
    rightIcon?: IconPlaceholder
    icon?: IconPlaceholder
    onPress?: AnyFunction
    styles?: StylesOf<ButtonComposition>
    loading?: boolean
    debugName: string
    debounce?: number
    selected?: boolean
    children?: React.ReactNode | ((props: ChildProps) => React.ReactNode)
  } & Partial<TouchableProps<'button'>>

export const Button = (buttonProps:ButtonProps) => {
  const {
    variants = [],
    responsiveVariants = {},
    children,
    icon,
    text,
    loading,
    styles,
    onPress,
    disabled,
    rightIcon,
    debounce = BUTTON_DEBOUNCE_TIME,
    selected,
    style,
    ...props
  } = buttonProps

  const [pressed, setPressed] = React.useState(false)
  const variantStyles = useDefaultComponentStyle('Button', {
    responsiveVariants,
    variants,
    styles,
  })

  function handlePress(e?: Parameters<ButtonProps['onPress']>[0]) {
    if (!pressed) {
      props?.onClick?.(e)

      setPressed(true)

      setTimeout(() => setPressed(false), debounce)

      onPress && onPress()
    }
  }

  function getStyles(key:ButtonParts) {

    return {
      ...variantStyles[key],
      ...optionalObject(key === 'wrapper', style, {}),
      ...optionalObject(disabled, variantStyles[key + ':disabled'], {}),
      ...optionalObject(selected, variantStyles[key + ':selected'], {}),
    }
  }
  const iconStyle = getStyles('icon')
  const leftIconStyle = getStyles('leftIcon')
  const rightIconStyle = getStyles('rightIcon')

  const textStyle = getStyles('text')

  const childrenContent = TypeGuards.isFunction(children) ?
    // @ts-ignore
    children({ styles: _styles, props: buttonProps })
    : children

  // TODO - This is a hack to hide the icon with display: none
  const isLeftIconVisible = !(leftIconStyle?.display != 'none')
  const shouldRenderLeftIcon = !loading && isLeftIconVisible

  return (
    <Touchable
      css={getStyles('wrapper')}
      component='button'
      debugComponent='Button'
      {...props}
      onPress={null}
      onClick={handlePress}
    >
      {shouldRenderLeftIcon && (
        <Icon
          name={icon}
          style={{ ...iconStyle, ...leftIconStyle }}

        />
      )}
      {text ? (
        <Text
          text={text}
          css={textStyle}
        />
      ) : null }
      {childrenContent}

      <Icon
        name={rightIcon}
        style={{ ...iconStyle, ...rightIconStyle }}

      />
      {loading && <ActivityIndicator css={{ display: 'none' }} />}
    </Touchable>
  )
}

export * from './styles'
