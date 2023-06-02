import React from 'react'
import { ComponentVariants, PropsOf, StylesOf, TypeGuards, useCodeleapContext, useDefaultComponentStyle } from '@codeleap/common'
import { Text } from '../Text'
import { View, ViewProps } from '../View'
import { BadgeComposition, BadgePresets } from './styles'
import { StyleSheet } from 'react-native'

export * from './styles'

export type BadgeProps = ComponentVariants<typeof BadgePresets> & ViewProps & {
  styles?: StylesOf<BadgeComposition>
  visible?: boolean
  count?: number
  maxCount?: number
  minCount?: number
  debugName: string
  innerWrapperProps?: Partial<PropsOf<typeof View>>
  textProps?: Partial<PropsOf<typeof Text>>
  getBadgeContent?: (props: BadgeProps) => string
  disabled?: boolean
  debug?: boolean
}

const defaultGetBadgeContent = ({ count, maxCount }: BadgeProps) => {
  if (Number(count) > maxCount) {
    return `${maxCount}+`
  } else {
    return String(count)
  }
}

export const Badge = (props: BadgeProps) => {
  const {
    debugName,
    innerWrapperProps = {},
    textProps = {},
    maxCount = 9,
    minCount = 1,
    count = null,
    visible = true,
    getBadgeContent = defaultGetBadgeContent,
    styles,
    variants,
    disabled,
    style = {},
    debug,
    ...rest
  } = props

  const { logger } = useCodeleapContext()

  const variantStyles = useDefaultComponentStyle<'u:Badge', typeof BadgePresets>('u:Badge', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })

  if (!visible) return null

  const content = React.useMemo(() => getBadgeContent({ ...props, maxCount, minCount }), [count])

  const wrapperStyles: ViewProps['style'] = React.useMemo(() => ([
    variantStyles?.wrapper,
    variantStyles?.['wrapper:disabled'],
    style,
  ]), [disabled])

  const innerWrapperStyles: ViewProps['style'] = React.useMemo(() => ([
    variantStyles?.innerWrapper,
    variantStyles?.['innerWrapper:disabled'],
    innerWrapperProps?.style,
  ]), [disabled])

  const countStyles = React.useMemo(() => ([
    variantStyles?.count,
    variantStyles?.['count:disabled'],
    textProps?.style,
  ]), [disabled])

  const showCount = TypeGuards.isNumber(count) && count >= minCount

  if (debug) {
    logger.log(debugName, {
      props,
      showCount,
      content,
    }, 'Badge')
  }

  return (
    <View
      {...rest}
      style={wrapperStyles}
    >
      <View {...innerWrapperProps} style={innerWrapperStyles}>
        {showCount 
          ? <Text text={content} {...textProps} style={countStyles} /> 
          : null
        }
      </View>
    </View>
  )
}
