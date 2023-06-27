import React from 'react'
import { View } from '../View'
import { SegmentedControlOption } from './SegmentedControlOption'
import { ComponentVariants, useDefaultComponentStyle, PropsOf, IconPlaceholder, StylesOf, useRef } from '@codeleap/common'
import { SegmentedControlPresets } from './styles'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { SegmentedControlComposition } from './styles'
import { motion, MotionProps, AnimationProps, ForwardRefComponent } from 'framer-motion'
import { useAnimatedVariantStyles } from '../../lib'

export type SegmentedControlOptionProps<T = string> = {
  label: string
  value: T
  icon?: IconPlaceholder
}

export type SegmentedControlProps<T = string> = ComponentVariants<typeof SegmentedControlPresets> & {

  /** options that the segmented control will receive */
  options : SegmentedControlOptionProps[]

  /** the value of the segmented control */
  value?: T

  /**  all styles from the segmented control */
  styles?: StylesOf<SegmentedControlComposition>

  /**  view style */
  style: PropsOf<typeof View>['style']

  /**  prop to control when te value of the segmented control changes */
  onValueChange?: (v: any) => void

  /**  motion div props */
  bubbleProps?: React.HTMLAttributes<HTMLDivElement> & MotionProps

  /** label that will be shown above the segmented control */
  label?: string

  /** * all the touchable props */
  touchableProps?: Partial<PropsOf<typeof Touchable>>

  debugName?: string
  disabled?: boolean
  animationProps?: AnimationProps
  transitionDuration?: number
  RenderAnimatedView?: ForwardRefComponent<HTMLDivElement, any>
}

const defaultProps: Partial<SegmentedControlProps> = {
  animationProps: {},
  transitionDuration: 0.2,
  disabled: false,
  RenderAnimatedView: motion.div
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
    disabled,
    RenderAnimatedView: Bubble,
    debugName,
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

  const currentOptionIdx = options?.findIndex(o => o?.value === value) || 0

  const maxDivWidthRef = useRef(null)

  const biggerWidth = React.useMemo(() => {
    return { 
      width: maxDivWidthRef.current 
    }
  }, [maxDivWidthRef.current])
  
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

  const selectedBubbleStyles = [
    variantStyles.selectedBubble, 
    disabled && variantStyles['selectedBubble:disabled'], 
    biggerWidth
  ]

  return (
    <View css={[variantStyles.wrapper, style]} {...rest}>
      {label && <Text text={label} css={[variantStyles.label, disabled && variantStyles['label:disabled']]} />}
      <View css={[variantStyles.innerWrapper, disabled && variantStyles['innerWrapper:disabled']]}>
        <Bubble
          css={selectedBubbleStyles}
          animate={bubbleAnimation}
          initial={false}
          {...bubbleProps}
        />
        {options.map((o, idx) => (
          <SegmentedControlOption
            maxDivWidthRef={maxDivWidthRef}
            debugName={debugName}
            label={o.label}
            value={o.value}
            onPress={() => onValueChange(o.value)}
            key={idx}
            icon={o.icon}
            selected={value === o.value}
            variantStyles={variantStyles}
            style={biggerWidth}
            disabled={disabled}
            {...props?.touchableProps}
          />
        ))}
      </View>
    </View>
  )
}

export * from './styles'

SegmentedControl.defaultProps = defaultProps
