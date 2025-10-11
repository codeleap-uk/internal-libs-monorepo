import React, { forwardRef } from 'react'
import { View } from '../View'
import { TypeGuards } from '@codeleap/types'
import { useRef } from '@codeleap/hooks'

import { Text } from '../Text'
import { motion, TargetAndTransition } from 'motion/react'
import { useAnimatedVariantStyles } from '../../lib'
import { SegmentedControlOptionProps, SegmentedControlProps } from './types'
import { Touchable } from '../Touchable'
import { Icon } from '../Icon'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, mergeStyles, StyledComponentProps } from '@codeleap/styles'

export * from './styles'
export * from './types'

const Option = (props: SegmentedControlOptionProps) => {
  const {
    selected,
    onPress,
    styles,
    iconProps = {},
    label,
    icon,
    largestWidth,
    textProps,
    disabled,
    ref,
    ...touchableProps
  } = props

  const iconStyles = mergeStyles([
    styles.icon,
    (selected ? styles['icon:selected'] : null),
    (disabled ? styles['icon:disabled'] : null),
  ])

  return (
    <Touchable
      key={touchableProps.key as any}
      ref={ref as unknown as React.Ref<HTMLButtonElement>}
      onPress={onPress}
      disabled={disabled}
      {...touchableProps}
      style={{
        ...styles.button,
        ...(selected ? styles['button:selected'] : {}),
        ...(disabled ? styles['button:disabled'] : {}),
        width: largestWidth?.width,
      }}
    >
      {!!icon ? (
        <Icon
          debugName={touchableProps?.debugName}
          name={icon}
          {...iconProps}
          style={iconStyles}
        />
      ) : null}
      <Text
        text={label}
        debugName={touchableProps?.debugName}
        {...textProps}
        style={{
          ...styles.text,
          ...(selected ? styles['text:selected'] : {}),
          ...(disabled ? styles['text:disabled'] : {}),
        }}
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
      } as TargetAndTransition
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
        onValueChange?.(option?.value)
        return
      }

      if (sectionPressedRef.current !== null) return

      onValueChange?.(option?.value)
      sectionPressedRef.current = setTimeout(() => {
        clearTimeout(sectionPressedRef.current)
        sectionPressedRef.current = null
      }, debounce)
    } else {
      return null
    }
  }

  return (
    <View {...rest} style={styles.wrapper}>
      {label ? <Text text={label} style={[styles.label, disabled && styles['label:disabled']]} /> : null}
      <View style={[styles.innerWrapper, disabled && styles['innerWrapper:disabled']]}>
        <Bubble
          // @ts-expect-error
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
            disabled={disabled}
            textProps={textProps}
            iconProps={iconProps}
            largestWidth={largestWidth}
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
