import { HTMLAttributes } from 'react'
import { View } from '../View'
import { SegmentedControlOption } from './SegmentedControlOption'
import { ComponentVariants, useDefaultComponentStyle, PropsOf, IconPlaceholder, StylesOf, useRef } from '@codeleap/common'
import { SegmentedControlPresets } from './styles'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { SegmentedControlComposition } from './styles'
import { motion, MotionProps, AnimationProps } from 'framer-motion'
import { useAnimatedVariantStyles } from '../../lib'

type SegmentedContropOptions<T = string> = {label: string; value: T; icon?: IconPlaceholder}

export type SegmentedControlProps<T = string> = ComponentVariants<typeof SegmentedControlPresets> & {

  /** options that the segmented control will receive */
  options : SegmentedContropOptions[]

  /** the value of the segmented control */
  value?: T

  /**  all styles from the segmented control */
  styles?: StylesOf<SegmentedControlComposition>

  /**  all styles from the segmented control */
  style: PropsOf<typeof View>['style']

  /**  prop to control when te value of the segmented control changes */
  onValueChange?: (v: any) => void

  /**  motion div props */
  bubbleProps?: HTMLAttributes<HTMLDivElement> & MotionProps

  /** label that will be shown above the segmented control */
  label?: string

  /** * all the touchable props */
  touchableProps?: Partial<PropsOf<typeof Touchable>>

  animationProps?: AnimationProps
  transitionDuration?: number
}

const defaultProps: Partial<SegmentedControlProps> = {
  animationProps: {},
  transitionDuration: 0.2,
}

export const SegmentedControl = (props: SegmentedControlProps) => {
  const allProps = {
    ...SegmentedControl.defaultProps,
    ...props,
  }

  const {
    label,
    options,
    styles = {},
    value,
    variants = [],
    responsiveVariants = {},
    onValueChange,
    style,
    bubbleProps,
    animationProps,
    transitionDuration,
    ...rest
  } = allProps

  const variantStyles = useDefaultComponentStyle<'u:SegmentedControl', typeof SegmentedControlPresets>(
    'u:SegmentedControl',
    {
      variants,
      responsiveVariants,
      styles,
    },
  )

  const currentOptionIdx = options?.findIndex(o => o.value === value) || 0

  const maxDivWidthRef = useRef(null)

  const biggerWidth = { width: maxDivWidthRef.current }
  
  const bubbleAnimation = useAnimatedVariantStyles({
    variantStyles,
    animatedProperties: [],
    updater: () => {
      'worklet'
      return {
        translateX: currentOptionIdx * biggerWidth.width,
        transition: { 
          ease: 'easeInOut', 
          duration: transitionDuration
        },
        ...animationProps,
      } as AnimationProps
    },
    dependencies: [currentOptionIdx, biggerWidth.width],
  })

  const selectedBubbleStyles = [variantStyles.selectedBubble, props?.touchableProps?.disabled && variantStyles['selectedBubble:disabled'], biggerWidth]

  return (
    <View css={[variantStyles.wrapper, style]} {...rest}>
      {label && <Text text={label} css={variantStyles.label} />}
      <View css={variantStyles.innerWrapper}>
        <motion.div
          css={selectedBubbleStyles}
          animate={bubbleAnimation}
          {...bubbleProps}
        />
        {options.map((o, idx) => (
          <SegmentedControlOption
            maxDivWidthRef={maxDivWidthRef}
            label={o.label}
            value={o.value}
            onPress={() => onValueChange(o.value)}
            key={idx}
            icon={o.icon}
            selected={value === o.value}
            variantStyles={variantStyles}
            style={biggerWidth}
            {...props?.touchableProps}
          />
        ))}
      </View>
    </View>
  )
}

export * from './styles'

SegmentedControl.defaultProps = defaultProps
