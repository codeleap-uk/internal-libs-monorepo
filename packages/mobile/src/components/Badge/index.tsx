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
  counter?: number
  borderSize?: number
  size?: number
  hasBorder?: boolean
  maxCounter?: number
  minCounter?: number
  debugName: string
  innerWrapperProps?: Partial<PropsOf<typeof View>>
  textProps?: Partial<PropsOf<typeof Text>>
  getBadgeContent?: (props: BadgeProps) => string
  disabled?: boolean
  debug?: boolean
}

// count

const defaultBorderSize = 4
const defaultSize = 2

const defaultGetBadgeContent = ({ counter, maxCounter }: BadgeProps) => {
  if (Number(counter) > maxCounter) {
    return `${maxCounter}+`
  } else {
    return String(counter)
  }
}

export const Badge = (props: BadgeProps) => {
  const {
    debugName,
    borderSize = defaultBorderSize,
    size = defaultSize,
    innerWrapperProps = {},
    textProps = {},
    maxCounter = 9,
    hasBorder,
    minCounter = 1,
    counter = null,
    visible = true,
    getBadgeContent = defaultGetBadgeContent,
    styles,
    variants,
    disabled,
    style = {},
    debug,
    ...rest
  } = props

  const { Theme, logger } = useCodeleapContext()

  const variantStyles = useDefaultComponentStyle<'u:Badge', typeof BadgePresets>('u:Badge', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })

  if (!visible) return null

  const _size = Number(variantStyles['__props']?.size ?? size)
  const _borderSize = Number(variantStyles['__props']?.borderSize ?? borderSize)
  const _hasBorder = variantStyles['__props']?.hasBorder || hasBorder

  const content = React.useMemo(() => getBadgeContent({ ...props, maxCounter, minCounter }), [counter])

  const { width, height } = Theme.sized(Number(_size))

  const borderSized = _hasBorder ? _borderSize : 0

  const wrapperStyles: ViewProps['style'] = React.useMemo(() => ([
    {
      width: width + borderSized,
      height: height + borderSized,
    },
    variantStyles?.wrapper,
    variantStyles?.['wrapper:disabled'],
    style,
  ]), [disabled, _size])

  const innerWrapperStyles: ViewProps['style'] = React.useMemo(() => ([
    variantStyles?.innerWrapper,
    variantStyles?.['innerWrapper:disabled'],
    innerWrapperProps?.style,
    {
      width: width - borderSized,
      height: height - borderSized,
    },
  ]), [disabled, borderSized])

  const counterStyles = React.useMemo(() => ([
    variantStyles?.counter,
    variantStyles?.['counter:disabled'],
    textProps?.style,
  ]), [disabled])

  const showCounter = TypeGuards.isNumber(counter) && counter >= minCounter

  if (debug) {
    logger.log(debugName, {
      _borderSize,
      _hasBorder,
      _size,
      props,
      showCounter,
      content,
    }, 'Badge')
  }

  return (
    <View
      {...rest}
      style={wrapperStyles}
    >
      <View {...innerWrapperProps} style={innerWrapperStyles}>
        {showCounter 
          ? <Text text={content} {...textProps} style={counterStyles} /> 
          : null
        }
      </View>
    </View>
  )
}
