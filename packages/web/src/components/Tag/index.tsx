import React from 'react'
import { TypeGuards, useDefaultComponentStyle, useNestedStylesByKey } from '@codeleap/common'
import { TagParts, TagPresets } from './styles'
import { TagProps } from './types'
import { Icon } from '../Icon'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { Badge } from '../Badge'

export * from './styles'
export * from './types'

const defaultProps: Partial<TagProps> = {
  debugName: 'Tag component',
  disabled: false,
}

export const Tag = (props: TagProps) => {
  const allProps = {
    ...Tag.defaultProps,
    ...props,
  }

  const {
    variants,
    rightComponent,
    leftComponent,
    responsiveVariants,
    styles,
    style,
    css,
    leftIcon,
    text,
    textProps,
    rightIcon,
    rightIconProps,
    leftIconProps,
    leftBadgeProps,
    leftBadge,
    rightBadge,
    rightBadgeProps,
    children,
    onPress,
    disabled,
    ...touchableProps
  } = allProps

  const variantStyles = useDefaultComponentStyle<'u:Tag', typeof TagPresets>('u:Tag', {
    variants,
    responsiveVariants,
    styles,
  })

  const leftBadgeStyles = useNestedStylesByKey('leftBadge', variantStyles)
  const rightBadgeStyles = useNestedStylesByKey('rightBadge', variantStyles)

  const isPressable = TypeGuards.isFunction(onPress)

  const Wrapper: any = isPressable ? Touchable : View

  const wrapperProps = isPressable ? { onPress, ...touchableProps } : touchableProps

  const getStylesByKey = (styleKey: TagParts) => ([
    variantStyles?.[styleKey],
    isPressable && variantStyles[`${styleKey}:pressable`],
    disabled && variantStyles[`${styleKey}:disabled`],
  ])

  const wrapperStyles = React.useMemo(() => ([
    getStylesByKey('wrapper'),
    css,
    style,
  ]), [variantStyles, disabled, isPressable, style])

  const textStyles = React.useMemo(() => getStylesByKey('text'), [variantStyles, disabled, isPressable])
  const leftIconStyles = React.useMemo(() => getStylesByKey('leftIcon'), [variantStyles, disabled, isPressable])
  const rightIconStyles = React.useMemo(() => getStylesByKey('rightIcon'), [variantStyles, disabled, isPressable])

  return (
    <Wrapper css={wrapperStyles} disabled={disabled} {...wrapperProps}>
      {leftComponent}
      {leftBadge && (
        <Badge
          debugName={`${touchableProps?.debugName}:leftBadge`}
          styles={leftBadgeStyles}
          badge={leftBadge}
          disabled={disabled}
          {...leftBadgeProps}
        />
      )}
      {!TypeGuards.isNil(leftIcon) && (
        <Icon
          debugName={`${touchableProps?.debugName}:leftIcon`}
          css={leftIconStyles}
          name={leftIcon}
          {...leftIconProps}
        />
      )}

      {TypeGuards.isString(text) ? <Text text={text} css={textStyles} {...textProps} /> : text}
      {children}

      {!TypeGuards.isNil(rightIcon) && (
        <Icon
          debugName={`${touchableProps?.debugName}:rightIcon`}
          css={rightIconStyles}
          name={rightIcon}
          {...rightIconProps}
        />
      )}
      {rightBadge && (
        <Badge
          debugName={`${touchableProps?.debugName}:rightBadge`}
          styles={rightBadgeStyles}
          badge={rightBadge}
          disabled={disabled}
          {...rightBadgeProps}
        />
      )}
      {rightComponent}
    </Wrapper>
  )
}

Tag.defaultProps = defaultProps
