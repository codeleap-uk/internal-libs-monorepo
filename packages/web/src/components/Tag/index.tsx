import React from 'react'
import { TypeGuards } from '@codeleap/common'
import { TagParts } from './styles'
import { TagProps } from './types'
import { Icon } from '../Icon'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { Badge } from '../Badge'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'

export const Tag = (props: TagProps) => {

  const {
    variants,
    rightComponent,
    leftComponent,
    style,
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
  } = {
    ...Tag.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Tag.styleRegistryName, style)

  const leftBadgeStyles = useNestedStylesByKey('leftBadge', styles)
  const rightBadgeStyles = useNestedStylesByKey('rightBadge', styles)

  const isPressable = TypeGuards.isFunction(onPress)

  const Wrapper: any = isPressable ? Touchable : View

  const wrapperProps = isPressable ? { onPress, ...touchableProps } : touchableProps

  const getStylesByKey = (styleKey: TagParts) => ([
    styles?.[styleKey],
    isPressable && styles[`${styleKey}:pressable`],
    disabled && styles[`${styleKey}:disabled`],
  ])

  const wrapperStyles = React.useMemo(() => ([
    getStylesByKey('wrapper'),
    style,
  ]), [styles, disabled, isPressable, style])

  const textStyles = React.useMemo(() => getStylesByKey('text'), [styles, disabled, isPressable])
  const leftIconStyles = React.useMemo(() => getStylesByKey('leftIcon'), [styles, disabled, isPressable])
  const rightIconStyles = React.useMemo(() => getStylesByKey('rightIcon'), [styles, disabled, isPressable])

  return (
    <Wrapper css={wrapperStyles} disabled={disabled} {...wrapperProps}>
      {leftComponent}
      {leftBadge && (
        <Badge
          debugName={`${touchableProps?.debugName}:leftBadge`}
          style={leftBadgeStyles}
          badge={leftBadge}
          disabled={disabled}
          {...leftBadgeProps}
        />
      )}
      {!TypeGuards.isNil(leftIcon) && (
        <Icon
          debugName={`${touchableProps?.debugName}:leftIcon`}
          style={leftIconStyles}
          name={leftIcon}
          {...leftIconProps}
        />
      )}

      {TypeGuards.isString(text) ? <Text text={text} style={textStyles} {...textProps} /> : text}
      {children}

      {!TypeGuards.isNil(rightIcon) && (
        <Icon
          debugName={`${touchableProps?.debugName}:rightIcon`}
          style={rightIconStyles}
          name={rightIcon}
          {...rightIconProps}
        />
      )}
      {rightBadge && (
        <Badge
          debugName={`${touchableProps?.debugName}:rightBadge`}
          style={rightBadgeStyles}
          badge={rightBadge}
          disabled={disabled}
          {...rightBadgeProps}
        />
      )}
      {rightComponent}
    </Wrapper>
  )
}

Tag.styleRegistryName = 'Tag'

Tag.elements = [
  `wrapper`,
  'text',
  'leftIcon',
  'rightIcon',
  'leftBadge',
  'rightBadge',
]

Tag.rootElement = 'wrapper'

Tag.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Tag as (props: StyledComponentProps<TagProps, typeof styles>) => IJSX
}

Tag.defaultProps = {
  debugName: 'Tag component',
  disabled: false,
} as Partial<TagProps>

WebStyleRegistry.registerComponent(Tag)

export * from './styles'
export * from './types'
