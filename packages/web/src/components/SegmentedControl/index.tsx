import React from 'react'
import { View } from '../View'
import { useRef, TypeGuards } from '@codeleap/common'
import { Text } from '../Text'
import { motion, AnimationProps } from 'framer-motion'
import { useAnimatedVariantStyles } from '../../lib'
import { OptionRef, SegmentedControlOptionProps, SegmentedControlProps } from './types'
import { Touchable } from '../Touchable'
import { Icon } from '../Icon'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'

const Option = (props: SegmentedControlOptionProps, ref: OptionRef) => {

  const {
    selected,
    onPress,
    styles,
    iconProps = {},
    label,
    icon,
    textProps,
    disabled,
    ...touchableProps
  } = props

  const iconStyles = {
    ...styles.icon as object,
    ...(selected ? styles['icon:selected'] as object : {}),
    ...(disabled ? styles['icon:disabled'] as object : {}),
  }

  return (
    <Touchable
      key={touchableProps.key}
      ref={ref}
      css={[
        styles.button,
        selected && styles['button:selected'],
        disabled && styles['button:disabled'],
        style as any,
      ]}
      onPress={onPress}
      disabled={disabled}
      {...touchableProps}
    >
      {
        !!icon && (
          <Icon
            debugName={touchableProps?.debugName}
            name={icon}
            style={iconStyles}
            {...iconProps}
          />
        )
      }
      <Text
        text={label}
        debugName={touchableProps?.debugName}
        css={[
          styles.text,
          selected && styles['text:selected'],
          disabled && styles['text:disabled'],
        ]}
        {...textProps}
      />
    </Touchable>
  )
}

export const SegmentedControl = (props: SegmentedControlProps) => {

  const {
    label,
    options,
    value,
    onValueChange,
    style,
    bubbleProps,
    animationProps,
    transitionDuration,
    disabled,
    RenderAnimatedView: Bubble,
    textProps,
    iconProps,
    debugName,
    debounce,
    debounceEnabled,
    ...rest
  } = {
    ...SegmentedControl.defaultProps,
    ...props,
  }

  const styles = useStylesFor(SegmentedControl.styleRegistryName, style)

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
    variantStyles: styles,
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
    styles.selectedBubble,
    disabled && styles['selectedBubble:disabled'],
    largestWidth,
  ]

  const onSelectTab = (option: SegmentedControlOptionProps, e?: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!e || e?.keyCode === 13 || e?.key === 'Enter') {
      if (!debounceEnabled || !TypeGuards.isNumber(debounce)) {
        onValueChange(option.value)
        return
      }

      if (sectionPressedRef.current !== null) return

      onValueChange(option.value)
      sectionPressedRef.current = setTimeout(() => {
        clearTimeout(sectionPressedRef.current)
        sectionPressedRef.current = null
      }, debounce)
    } else {
      return null
    }
  }

  return (
    <View css={[styles.wrapper, style]} {...rest}>
      {label && <Text text={label} css={[styles.label, disabled && styles['label:disabled']]} />}
      <View css={[styles.innerWrapper, disabled && styles['innerWrapper:disabled']]}>
        <Bubble
          css={selectedBubbleStyles}
          animate={bubbleAnimation}
          initial={false}
          {...bubbleProps}
        />
        {options.map((o, idx) => (
          <Option
            ref={(ref) => {
              if (ref && ref.offsetWidth > maxDivWidthRef.current) {
                maxDivWidthRef.current = ref.offsetWidth
              }
            }}
            debugName={debugName}
            label={o.label}
            value={o.value}
            onPress={() => onSelectTab(o)}
            onKeyDown={(e) => onSelectTab(o, e)}
            key={idx}
            icon={o.icon}
            selected={value === o.value}
            styles={styles}
            style={largestWidth}
            disabled={disabled}
            textProps={textProps}
            iconProps={iconProps}
            tabIndex={0}
            {...props?.touchableProps}
          />
        ))}
      </View>
    </View>
  )
}

SegmentedControl.styleRegistryName = 'SegmentedControl'

SegmentedControl.elements = [
  'wrapper',
  'innerWrapper',
  'selectedBubble',
  'text',
  'icon',
  'button',
  'label',
]

SegmentedControl.rootElement = 'wrapper'

SegmentedControl.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return SegmentedControl as (props: StyledComponentProps<SegmentedControlProps, typeof styles>) => IJSX
}

SegmentedControl.defaultProps = {
  animationProps: {},
  transitionDuration: 0.2,
  disabled: false,
  RenderAnimatedView: motion.div,
  debounce: 1000,
  debounceEnabled: true,
} as Partial<SegmentedControlProps>

WebStyleRegistry.registerComponent(SegmentedControl)

export * from './styles'
export * from './types'
