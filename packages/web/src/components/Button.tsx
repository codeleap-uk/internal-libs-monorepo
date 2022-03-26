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
} from '@codeleap/common'
import React, { ComponentPropsWithRef } from 'react'
import { StylesOf } from '../types/utility'
import { Text } from './Text'
import { Touchable, TouchableProps } from './Touchable'
import { Icon } from './Icon'
import { ActivityIndicator } from './ActivityIndicator'
import { IconPlaceholder } from '@codeleap/common'

type NativeButtonProps = ComponentPropsWithRef<'button'>

export type ButtonProps = NativeButtonProps &
  ComponentVariants<typeof ButtonStyles> & {
    text?: string
    rightIcon?: IconPlaceholder
    icon?: IconPlaceholder
    onPress?: AnyFunction
    styles?: StylesOf<ButtonComposition>
    loading?: boolean
    debugName?: string
    debounce?: number
  } & Partial<TouchableProps<any>>

export const Button: React.FC<ButtonProps> = (buttonProps) => {
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
    debounce = 600,
    ...props
  } = buttonProps
  const [pressed, setPressed] = React.useState(false)
  const variantStyles = useDefaultComponentStyle('Button', {
    responsiveVariants,
    variants,
    styles,
  })

  function handlePress(e: Parameters<ButtonProps['onPress']>[0]) {
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
      ...optionalObject(disabled, variantStyles[key + ':disabled'], {}),
    }
  }
  const iconStyle = getStyles('icon')
  return (
    <Touchable
      css={getStyles('wrapper')}
      component='button'
      debugComponent='Button'

      onPress={handlePress}
      {...props}
    >
      {loading && <ActivityIndicator styles={{
        'wrapper': getStyles('loaderWrapper'),
        'backCircle': getStyles('loaderBackCircle'),
        'frontCircle': getStyles('loaderFrontCircle'),
        'circle': getStyles('loaderCircle'),
      }} css={getStyles('loader')}/>}
      {!loading && (
        <Icon
          name={icon}
          style={{ ...iconStyle, ...getStyles('leftIcon') }}
          renderEmptySpace={!!text}
        />
      )}
      {children || (
        <Text
          text={text}
          styles={{
            text: getStyles('text'),
          }}
        />
      )}

      <Icon
        name={rightIcon}
        style={{ ...iconStyle, ...getStyles('rightIcon') }}
        renderEmptySpace={!!text}
      />
    </Touchable>
  )
}
