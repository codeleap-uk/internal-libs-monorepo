import React from 'react'
import { View } from '../View'
import { SegmentedControlOption } from './SegmentedControlOption'
import { ComponentVariants, useDefaultComponentStyle, PropsOf, IconPlaceholder, StylesOf, useRef, TypeGuards } from '@codeleap/common'
import { SegmentedControlPresets } from './styles'
import { Text } from '../Text'
import { Touchable } from '../Touchable'
import { SegmentedControlComposition } from './styles'
import { motion, MotionProps, AnimationProps, ForwardRefComponent } from 'framer-motion'
import { useAnimatedVariantStyles } from '../../lib'
import { IconProps } from '../Icon'

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
  style?: PropsOf<typeof View>['style']

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
  textProps?: Omit<PropsOf<typeof Text>, 'key'>
  iconProps?: Partial<IconProps>
  debounce?: number
  debounceEnabled?: boolean
}

const defaultProps: Partial<SegmentedControlProps> = {
  animationProps: {},
  transitionDuration: 0.2,
  disabled: false,
  RenderAnimatedView: motion.div,
  debounce: 1000,
  debounceEnabled: true,
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
    textProps = {},
    iconProps = {},
    debugName,
    debounce,
    debounceEnabled,
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

  const currentOptionIdx = React.useMemo(() => {
    return options?.findIndex(o => o?.value === value) || 0
  }, [value])

  const maxDivWidthRef = useRef(null)
  const sectionPressedRef = useRef(null)

  const largestWidth = React.useMemo(() => {
    return {
      width: maxDivWidthRef.current,
    }
  }, [maxDivWidthRef.current])

  const bubbleAnimation = useAnimatedVariantStyles({
    variantStyles,
    animatedProperties: [],
    updater: () => {
      'worklet'
      return {
        translateX: currentOptionIdx * largestWidth.width,
        transition: {
          ease: 'easeInOut',
          duration: transitionDuration,
        },
        ...animationProps,
      } as AnimationProps
    },
    dependencies: [currentOptionIdx, largestWidth.width],
  })

  const selectedBubbleStyles = [
    variantStyles.selectedBubble,
    disabled && variantStyles['selectedBubble:disabled'],
    largestWidth,
  ]

  const onSelectTab = (option: SegmentedControlOptionProps) => {
    if (!debounceEnabled || !TypeGuards.isNumber(debounce)) {
      onValueChange(option.value)
      return
    }

    if (sectionPressedRef.current !== null) return

    onValueChange(option.value)
    sectionPressedRef.current = setTimeout(() => {
      clearInterval(sectionPressedRef.current)
      sectionPressedRef.current = null
    }, debounce)
  }

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
            ref={(ref) => {
              if (ref && ref.offsetWidth > maxDivWidthRef.current) {
                maxDivWidthRef.current = ref.offsetWidth
              }
            }}
            debugName={debugName}
            label={o.label}
            value={o.value}
            onPress={() => onSelectTab(o)}
            key={idx}
            icon={o.icon}
            selected={value === o.value}
            variantStyles={variantStyles}
            style={largestWidth}
            disabled={disabled}
            textProps={textProps}
            iconProps={iconProps}
            {...props?.touchableProps}
          />
        ))}
      </View>
    </View>
  )
}

export * from './styles'

SegmentedControl.defaultProps = defaultProps
