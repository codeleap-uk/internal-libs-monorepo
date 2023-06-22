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
  TypeGuards,
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

type ChildProps = {
  styles: StylesOf<ButtonParts>
  props: Omit<ButtonProps, 'children'>
}

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
    selected?: boolean
    children?: React.ReactNode | ((props: ChildProps) => React.ReactNode)
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
      ...optionalObject(key === 'wrapper', style, {}),
      ...optionalObject(disabled, variantStyles[key + ':disabled'], {}),
      ...optionalObject(selected, variantStyles[key + ':selected'], {}),
    }
  }
  const iconStyle = getStyles('icon')

  const childrenContent = TypeGuards.isFunction(children) ?
    // @ts-ignore
    children({ styles: _styles, props: buttonProps })
    : children

  // TODO - This is a hack to hide the icon when there is no text
  const isLeftIconHidden = iconStyle?.display != 'none'

  return (
    <Touchable
      css={getStyles('wrapper')}
      component='button'
      debugComponent='Button'

      onPress={handlePress}
      {...props}
    >
      {(!loading && isLeftIconHidden) && (
        <Icon
          name={icon}
          style={{ ...iconStyle, ...getStyles('leftIcon') }}

        />
      )}
      {text ? (
        <Text
          text={text}
          styles={{
            text: getStyles('text'),
          }}
        />
      ) : null }
      {childrenContent}

      <Icon
        name={rightIcon}
        style={{ ...iconStyle, ...getStyles('rightIcon') }}

      />
      {loading && <ActivityIndicator css={getStyles('loader')}/>}
    </Touchable>
  )
}

export * from './styles'
