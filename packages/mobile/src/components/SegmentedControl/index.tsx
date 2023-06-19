import React, { ReactElement, useImperativeHandle, useMemo, useRef } from 'react'
import { Scroll, ScrollProps } from '../Scroll'

import { Easing, StyleSheet } from 'react-native'
import { FormTypes, getNestedStylesByKey, PropsOf, TypeGuards, useCodeleapContext, useDefaultComponentStyle } from '@codeleap/common'
import { SegmentedControlComposition, SegmentedControlPresets } from './styles'
import { Touchable } from '../Touchable'
import { StylesOf } from '../../types/utility'
import { Text } from '../Text'
import { KeyboardAwareScrollViewTypes } from '../../modules'
import { View } from '../View'
import { InputLabel } from '../InputLabel'
import { useAnimatedVariantStyles, TransitionConfig } from '../../utils'
import { SegmentedControlOption } from './Option'
import { IconPlaceholder } from '@codeleap/common'
import { Badge, BadgeProps } from '../Badge'

export * from './styles'
export type SegmentedControlRef =KeyboardAwareScrollViewTypes.KeyboardAwareScrollView & {
  scrollTo: (index: number) => void
  scrollToCurrent: () => void
}

type SegmentedContropOptions<T = string> = {label: string; value: T; icon?: IconPlaceholder; badge?: BadgeProps['badge']}

export type SegmentedControlProps<T = string> = ScrollProps & {
    options : SegmentedContropOptions[]
    onValueChange: (value: T) => any
    value: T
    debugName: string
    animation?: TransitionConfig
    textProps?: Partial<PropsOf<typeof Text>>
    touchableProps?: Partial<PropsOf<typeof Touchable>>
    styles?: StylesOf<SegmentedControlComposition>
    scrollProps?: any
    label?: FormTypes.Label
    RenderButton?: (props: SegmentedControlProps & {
      touchableProps: PropsOf<typeof Touchable>
      textProps: PropsOf<typeof Text>
      option: SegmentedContropOptions
    }) => ReactElement
    RenderAnimatedView?: (props: Partial<SegmentedControlProps>) => ReactElement
    getItemWidth?: (item: SegmentedContropOptions, idx: number, arr: SegmentedContropOptions[]) => number
    badgeProps?: Partial<BadgeProps>
}

const defaultAnimation = {
  type: 'timing',
  duration: 200,
  easing: Easing.linear,
}

const _SegmentedControl = React.forwardRef<SegmentedControlRef, SegmentedControlProps>((props, ref) => {

  const { Theme } = useCodeleapContext()

  const {
    options = [],
    onValueChange,
    debugName,
    label,
    value,
    styles = {},
    animation = {},
    variants = [],
    scrollProps = {},
    getItemWidth = (i) => (Theme.values.width - Theme.spacing.value(4)) / options.length,
    RenderAnimatedView,
    RenderButton,
    badgeProps = {},
  } = props

  const _animation = {
    ...defaultAnimation, ...animation,
  }

  let variantStyles = useDefaultComponentStyle<'u:SegmentedControl', typeof SegmentedControlPresets>('u:SegmentedControl', {
    styles,
    transform: StyleSheet.flatten,
    variants,
    rootElement: 'scroll',
  })

  const scrollRef = useRef<KeyboardAwareScrollViewTypes.KeyboardAwareScrollView>(null)

  function scrollTo(idx:number) {
    if (!scrollRef.current) return
    setTimeout(() => {
      scrollRef.current?.scrollToPosition?.(widthStyle.width * idx, 0, true)
    })
  }

  const widthStyle = useMemo(() => {
    const sizes = options.map(getItemWidth)
    const maxWidth = sizes.sort((a, b) => b - a)[0]

    return { width: maxWidth }
  }, [options])

  const currentOptionIdx = options.findIndex(o => o.value === value) || 0

  const onPress = (txt:string, idx: number) => {
    return () => {
      onValueChange(txt)
      scrollTo(idx)
    }
  }

  const hasScrolledInitially = useRef(false)

  useImperativeHandle(ref, () => {
    if (!scrollRef.current) return null

    return {
      ...(scrollRef.current),
      scrollTo,
      scrollToCurrent() {
        if (!scrollRef.current) return
        scrollTo(currentOptionIdx)
      },
    } as SegmentedControlRef
  })

  if (!hasScrolledInitially.current && scrollRef.current) {
    scrollTo(currentOptionIdx)
    hasScrolledInitially.current = true
  }

  const BubbleView = RenderAnimatedView || View
  variantStyles = JSON.parse(JSON.stringify(variantStyles))

  const labelStyles = getNestedStylesByKey('label', variantStyles)

  const bubbleAnimation = useAnimatedVariantStyles({
    variantStyles,
    animatedProperties: [],
    updater: () => {
      'worklet'
      return {
        translateX: currentOptionIdx * widthStyle.width,
      }
    },
    transition: _animation,
    dependencies: [currentOptionIdx, widthStyle.width],
  })

  const badgeStyles = getNestedStylesByKey('badge', variantStyles)

  return (<View style={variantStyles.wrapper}>
    <InputLabel label={label} styles={labelStyles} required={false}/>
    <Scroll
      horizontal
      showsHorizontalScrollIndicator={false}
      style={variantStyles.scroll}
      contentContainerStyle={variantStyles.scrollContent}
      {...scrollProps}
      keyboardAware={{
        enabled: false,
      }}
      ref={scrollRef}
    >
      <View style={variantStyles.innerWrapper}>
        <BubbleView
          options={options}
          styles={variantStyles}
          animated
          style={[variantStyles.selectedBubble, props?.touchableProps?.disabled && variantStyles['selectedBubble:disabled'], widthStyle, bubbleAnimation]}

        />
        {options.map((o, idx) => (
          <SegmentedControlOption
            debugName={debugName}
            label={o.label}
            value={o.value}
            icon={o.icon}
            onPress={onPress(o.value, idx)}
            key={idx}
            style={widthStyle}
            selected={value === o.value}
            variantStyles={variantStyles}
            badge={!TypeGuards.isNil(o.badge) ? <Badge badge={o.badge} styles={badgeStyles} {...badgeProps} /> : null}
          />
        ))}
      </View>
    </Scroll>
  </View>
  )

})

type SegControlComponent = <T = string>(props: SegmentedControlProps<T> & {ref?: React.Ref<SegmentedControlRef>}) => ReactElement

export const SegmentedControl = _SegmentedControl as SegControlComponent
