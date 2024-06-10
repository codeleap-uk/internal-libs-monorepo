import React from 'react'
import { TypeGuards } from '@codeleap/common'
import { Text } from '../Text'
import { View } from '../View'
import { BadgeContent, BadgeProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, GenericStyledComponentAttributes, IJSX, StyledComponentProps } from '@codeleap/styles'
import { ComponentWithDefaultProps } from '../../types'

const defaultGetBadgeContent = ({ count, maxCount }: BadgeContent) => {
  if (Number(count) > maxCount) {
    return `${maxCount}+`
  } else {
    return String(count)
  }
}

export const Badge: ComponentWithDefaultProps<BadgeProps> & GenericStyledComponentAttributes<AnyRecord> = (props: BadgeProps) => {

  const {
    debugName,
    innerWrapperProps,
    textProps,
    maxCount,
    minCount,
    getBadgeContent,
    renderBadgeContent,
    disabled,
    style,
    badge,
    ...rest
  } = {
    ...Badge.defaultProps,
    ...props,
  }

  const styles = useStylesFor(Badge.styleRegistryName, style)

  const visible = (TypeGuards.isBoolean(badge) && badge === true) || TypeGuards.isNumber(badge)

  if (!visible) return null

  const wrapperStyles = [
    styles?.wrapper,
    (disabled && styles?.['wrapper:disabled']),
    style,
  ]

  const innerWrapperStyles = [
    styles?.innerWrapper,
    (disabled && styles?.['innerWrapper:disabled']),
    innerWrapperProps?.style,
  ]

  const countStyles = [
    styles?.count,
    (disabled && styles?.['count:disabled']),
    textProps?.style,
  ]

  const count = TypeGuards.isNumber(badge) ? badge : null

  const content = getBadgeContent({ ...props, maxCount, minCount, count })

  const showContent = TypeGuards.isNumber(count) && count >= minCount

  let BadgeContent = renderBadgeContent

  if (TypeGuards.isNil(renderBadgeContent)) {
    // @ts-expect-error @verify
    BadgeContent = () => <Text text={content} {...textProps} style={countStyles} />
  }

  return (
    <View {...rest} style={wrapperStyles}>
      <View {...innerWrapperProps} style={innerWrapperStyles}>
        {showContent
          ? <BadgeContent
            {...props}
            maxCount={maxCount}
            minCount={minCount}
            count={count}
            getBadgeContent={getBadgeContent}
            content={content}
          />
          : null
        }
      </View>
    </View>
  )
}

Badge.styleRegistryName = 'Badge'

Badge.elements = ['wrapper', 'innerWrapper', 'count']

Badge.rootElement = 'wrapper'

Badge.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Badge as (props: StyledComponentProps<BadgeProps, typeof styles>) => IJSX
}

Badge.defaultProps = {
  maxCount: 9,
  minCount: 1,
  getBadgeContent: defaultGetBadgeContent,
  renderBadgeContent: null,
  disabled: false,
  badge: true,
} as Partial<BadgeProps>

WebStyleRegistry.registerComponent(Badge)

export * from './styles'
export * from './types'
