/** @jsx jsx */
import { jsx } from '@emotion/react'
import {
  useDefaultComponentStyle,
  ButtonStyles,
  ComponentVariants,
  ButtonComposition,
  ButtonParts,
  optionalObject,
} from '@codeleap/common'
import React, { ComponentPropsWithRef } from 'react'
import { StylesOf } from '../types/utility'
import { Text } from './Text'
import { Touchable } from './Touchable'
import { Icon } from './Icon'
import { ActivityIndicator } from './ActivityIndicator'
import { IconPlaceholder } from '@codeleap/common'

type NativeButtonProps = ComponentPropsWithRef<'button'>;

export type ButtonProps = NativeButtonProps &
  ComponentVariants<typeof ButtonStyles> & {
    text?: string;
    rightIcon?: IconPlaceholder;
    icon?: IconPlaceholder;
    onPress?: NativeButtonProps['onClick'];
    styles?: StylesOf<ButtonComposition>;
    loading?: boolean;
  };

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
    ...props
  } = buttonProps

  const variantStyles = useDefaultComponentStyle('Button', {
    responsiveVariants,
    variants,
    styles,
  })

  function handlePress(e: Parameters<ButtonProps['onPress']>[0]) {
    props.onClick && props.onClick(e)
    onPress && onPress(e)
  }

  function getStyles(key:ButtonParts){
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
      onClick={handlePress}
      {...props}
    >
      {loading && <ActivityIndicator css={getStyles('loader')} />}
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
    </Touchable>
  )
}
