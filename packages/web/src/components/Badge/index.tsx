import React from 'react'
import { ComponentVariants, PropsOf, StylesOf, TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
import { Text } from '../Text'
import { View, ViewProps } from '../View'
import { BadgeComposition, BadgePresets } from './styles'
import { ComponentCommonProps } from '../../types'

export * from './styles'

/** * Badge */
export type BadgeProps = ComponentVariants<typeof BadgePresets>
  & ViewProps<'div'>
  & ComponentCommonProps
  & {
    styles?: StylesOf<BadgeComposition>
    /** prop */
    maxCount?: number
    /** prop */
    minCount?: number
    /** prop */
    debugName?: string
    innerWrapperProps?: Partial<PropsOf<typeof View>>
    textProps?: Partial<PropsOf<typeof Text>>
    /** prop */
    getBadgeContent?: (props: BadgeContent) => string
    /** prop */
    renderBadgeContent?: (props: BadgeContent & { content: string }) => JSX.Element
    /** prop */
    disabled?: boolean
    /** prop */
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
    variants = [],
    responsiveVariants = {},
    disabled,
    style = {},
    css,
    badge,
    ...rest
  } = allProps

  const visible = (TypeGuards.isBoolean(badge) && badge === true) || TypeGuards.isNumber(badge)

  if (!visible) return null

  const variantStyles = useDefaultComponentStyle<'u:Badge', typeof BadgePresets>('u:Badge', {
    responsiveVariants,
    variants,
    styles,
    rootElement: 'wrapper',
  })

  const wrapperStyles = [
    variantStyles?.wrapper,
    (disabled && variantStyles?.['wrapper:disabled']),
    css,
    style,
  ]

  const innerWrapperStyles = [
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
    BadgeContent = () => <Text text={content} {...textProps} css={countStyles} />
  }

  return (
    <View {...rest} css={wrapperStyles}>
      <View {...innerWrapperProps} css={innerWrapperStyles}>
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
