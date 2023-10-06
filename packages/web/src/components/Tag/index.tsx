import { TypeGuards, useDefaultComponentStyle, useNestedStylesByKey } from '@codeleap/common'
import { TagPresets } from './styles'
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

  const Wrapper = isPressable ? Touchable : View

  const pressableProps = isPressable ? { onPress, ...touchableProps } : {}

  return (
    <Wrapper css={[variantStyles.wrapper, style]} {...pressableProps}>
      <View style={variantStyles.innerWrapper}>
        {leftComponent}
        {leftBadge && <Badge styles={leftBadgeStyles} {...leftBadgeProps} />}
        {!TypeGuards.isNil(leftIcon) && <Icon debugName='Tag:leftIcon' css={variantStyles.leftIcon} name={leftIcon} {...leftIconProps} />}
        {TypeGuards.isString(text) ? <Text text={text} style={variantStyles.text} {...textProps} /> : text}
        {children}
        {!TypeGuards.isNil(rightIcon) && <Icon debugName='Tag:rightIcon' css={variantStyles.rightIcon} name={rightIcon} {...rightIconProps} />}
        {rightBadge && <Badge styles={rightBadgeStyles} {...rightBadgeProps} />}
        {rightComponent}
      </View>
    </Wrapper>
  )
}

Tag.defaultProps = defaultProps
