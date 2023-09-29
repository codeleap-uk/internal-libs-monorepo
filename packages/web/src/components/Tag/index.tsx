import { TypeGuards, useDefaultComponentStyle } from '@codeleap/common'
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
    onPress,
    ...rest }
    = allProps

  const variantStyles = useDefaultComponentStyle<'u:Tag', typeof TagPresets>('u:Tag', {
    variants,
    responsiveVariants,
    styles,
  })

  const isPressable = TypeGuards.isFunction(onPress)

  return (
    <View css={[variantStyles.wrapper, style]}
      {...rest}>
      <Touchable disabled={!isPressable}
        onPress={onPress}>
        <View
          style={variantStyles.innerWrapper}>
          {leftComponent}
          {leftBadge && <Badge css={variantStyles.leftBadge} {...leftBadgeProps} />}
          {leftIcon && <Icon css={variantStyles.leftIcon} name={leftIcon} {...leftIconProps} />}
          {!!text && <Text text={text} style={variantStyles.text} {...textProps} />}
          {rightIcon && <Icon css={variantStyles.rightIcon} name={rightIcon} {...rightIconProps} />}
          {rightBadge && <Badge css={variantStyles.rightBadge} {...rightBadgeProps} />}
          {rightComponent}
        </View>
      </Touchable>
    </View>
  )
}

Tag.defaultProps = defaultProps
