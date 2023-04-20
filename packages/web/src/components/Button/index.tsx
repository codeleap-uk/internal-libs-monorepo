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
import { StylesOf } from '../../types/utility'
import { Text } from '../Text'
import { Touchable, TouchableProps } from '../Touchable'
import { Icon } from '../Icon'
import { ActivityIndicator } from '../ActivityIndicator'
import { IconPlaceholder, useNestedStylesByKey } from '@codeleap/common'
import { LoadingOverlay } from '../LoadingOverlay'

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

  const loaderStyle = useNestedStylesByKey('loading', variantStyles)

  return (
    <Touchable
      css={getStyles('wrapper')}
      component='button'
      debugComponent='Button'

      onPress={handlePress}
      {...props}
    >
      <LoadingOverlay 
        visible={loading}
        styles={loaderStyle}
      />
      {!loading && (
        <Icon
          name={icon}
          style={{ ...iconStyle, ...getStyles('leftIcon') }}
          
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
        
        />
        {loading && <ActivityIndicator styles={{
          'wrapper': getStyles('loaderWrapper'),
          'backCircle': getStyles('loaderBackCircle'),
          'frontCircle': getStyles('loaderFrontCircle'),
          'circle': getStyles('loaderCircle'),
        }} css={getStyles('loader')}/>}
    </Touchable>
  )
}

export * from './styles'