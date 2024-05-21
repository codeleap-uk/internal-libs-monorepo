import React from 'react'
import { TypeGuards } from '@codeleap/common'
import { Text } from '../Text'
import { View, ViewProps } from '../View'
import { BadgeContent, BadgeProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { AnyRecord, IJSX, StyledComponentProps, useStyleObserver } from '@codeleap/styles'

export * from './styles'
export * from './types'

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
    disabled,
    style,
    badge,
    ...rest
  } = allProps

  const visible = (TypeGuards.isBoolean(badge) && badge === true) || TypeGuards.isNumber(badge)

  const styleObserver = useStyleObserver(style)

  const styles = React.useMemo(() => {
    return MobileStyleRegistry.current.styleFor(Badge.styleRegistryName, style)
  }, [styleObserver])

  if (!visible) return null
  
  const wrapperStyles: ViewProps['style'] = [
    styles?.wrapper,
    (disabled && styles?.['wrapper:disabled']),
  ]

  const innerWrapperStyles: ViewProps['style'] = [
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
Badge.defaultProps = defaultProps

Badge.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Badge as (props: StyledComponentProps<BadgeProps, typeof styles>) => IJSX
}

MobileStyleRegistry.registerComponent(Badge)
