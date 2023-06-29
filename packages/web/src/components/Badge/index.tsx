import React from 'react'
import { ComponentVariants, PropsOf, StylesOf, TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import { Text } from '../Text'
import { View, ViewProps } from '../View'
import { BadgeComposition, BadgePresets } from './styles'

export * from './styles'

export type BadgeProps = ComponentVariants<typeof BadgePresets>
  & ViewProps
  & {
    styles?: StylesOf<BadgeComposition>
    maxCount?: number
    minCount?: number
    debugName?: string
    innerWrapperProps?: Partial<PropsOf<typeof View>>
    textProps?: Partial<PropsOf<typeof Text>>
    getBadgeContent?: (props: BadgeContent) => string
    renderBadgeContent?: (props: BadgeContent & { content: string }) => JSX.Element
    disabled?: boolean
    badge?: number | boolean
  }

type BadgeContent = BadgeProps & { count: number }

export type BadgeComponentProps = {
  badge?: BadgeProps['badge']
  badgeProps?: Partial<BadgeProps>
}

const defaultGetBadgeContent = ({ count, maxCount }: BadgeContent) => {
  if (Number(count) > maxCount) {
    return `${maxCount}+`
  } else {
    return String(count)
  }
}

const defaultProps: Partial<BadgeProps> = {
  maxCount: 9,
  minCount: 1,
  getBadgeContent: defaultGetBadgeContent,
  renderBadgeContent: null,
  disabled: false,
  badge: true,
}

export const Badge = (props: BadgeProps) => {
  const allProps = {
    ...Badge.defaultProps,
    ...props,
  }

  const {
    debugName,
    innerWrapperProps = {},
    textProps = {},
    maxCount,
    minCount,
    getBadgeContent,
    renderBadgeContent,
    styles = {},
    variants,
    disabled,
    style = {},
    badge,
    ...rest
  } = allProps

  const visible = (TypeGuards.isBoolean(badge) && badge === true) || TypeGuards.isNumber(badge)

  if (!visible) return null

  const variantStyles = useDefaultComponentStyle<'u:Badge', typeof BadgePresets>('u:Badge', {
    variants,
    styles,
    rootElement: 'wrapper',
  })

  const wrapperStyles: ViewProps['style'] = [
    variantStyles?.wrapper,
    (disabled && variantStyles?.['wrapper:disabled']),
    style,
  ]

  const innerWrapperStyles: ViewProps['style'] = [
    variantStyles?.innerWrapper,
    (disabled && variantStyles?.['innerWrapper:disabled']),
    innerWrapperProps?.style,
  ]

  const countStyles = [
    variantStyles?.count,
    (disabled && variantStyles?.['count:disabled']),
    textProps?.style,
  ]

  const count = TypeGuards.isNumber(badge) ? badge : null

  const content = getBadgeContent({ ...props, maxCount, minCount, count })

  const showContent = TypeGuards.isNumber(count) && count >= minCount

  let BadgeContent = renderBadgeContent

  if (TypeGuards.isNil(renderBadgeContent)) {
    BadgeContent = () => <Text text={content} {...textProps} style={countStyles} />
  }

  return (
    <View
      {...rest}
      style={wrapperStyles}
    >
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

Badge.defaultProps = defaultProps
