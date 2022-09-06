import React, { ReactElement, useImperativeHandle, useMemo, useRef } from 'react'
import { Scroll, ScrollProps } from '../Scroll'

import { Easing, EasingFunction, StyleSheet } from 'react-native'
import { FormTypes, getNestedStylesByKey, PropsOf, useDefaultComponentStyle } from '@codeleap/common'
import { SegmentedControlComposition, SegmentedControlStyles } from './styles'
import { Touchable } from '../Touchable'
import { StylesOf } from '../../types/utility'
import { Text, TextProps } from '../Text'
import { KeyboardAwareScrollViewTypes } from '../../modules'
import { View } from '../View'
import { InputLabel } from '../InputLabel'
export * from './styles'
export type SegmentedControlRef =KeyboardAwareScrollViewTypes.KeyboardAwareScrollView & {
  scrollTo: (index: number) => void
  scrollToCurrent: () => void
}

export type SegmentedControlProps<T = string> = ScrollProps & {
    options : {label: string; value: T }[]
    onValueChange: (value: T) => any
    value: T
    debugName: string
    animation?: {
      duration?: number
      easing?: EasingFunction
    }
    textProps?: Partial<PropsOf<typeof Text>>
    touchableProps?: Partial<PropsOf<typeof Touchable>>
    styles?: StylesOf<SegmentedControlComposition>
    scrollProps?: any
    label?: FormTypes.Label
    RenderButton?: (props: SegmentedControlProps & {
      touchableProps: PropsOf<typeof Touchable>
      textProps: PropsOf<typeof Text>
      option: {label: string; value: any}
    }) => ReactElement
    RenderAnimatedView?: (props: Partial<SegmentedControlProps>) => ReactElement
    getItemWidth?: (item:{label: string; value: T }, idx: number, arr: {label: string; value: T }[]) => number
}

const defaultAnimation = {
  type: 'timing',
  duration: 200,
  easing: Easing.linear,
}

const _SegmentedControl = React.forwardRef<SegmentedControlRef, SegmentedControlProps>((props, ref) => {
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
    getItemWidth = (i) => i.label.length * 20,
    RenderAnimatedView,
    RenderButton,
  } = props

  let _animation = {
    ...defaultAnimation, ...animation,
  }

  let variantStyles = useDefaultComponentStyle<'u:SegmentedControl', typeof SegmentedControlStyles>('u:SegmentedControl', {
    styles,
    transform: StyleSheet.flatten,
    variants,
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

  const translateX = widthStyle.width * currentOptionIdx

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

  const AnimatedView = RenderAnimatedView || View
  variantStyles = JSON.parse(JSON.stringify(variantStyles))
  _animation = JSON.parse(JSON.stringify(_animation))

  const labelStyles = getNestedStylesByKey('label', variantStyles)
  return (<>
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
      <View style={variantStyles.wrapper}>
        <AnimatedView
          options={options}
          styles={variantStyles}

          animated
          style={[variantStyles.selectedBubble, widthStyle]}
          animate={{
            translateX,
          }}
          transition={{
            translateX: _animation,
          }}

        />
        {options.map((o, idx) => {
          const selected = value === o.value

          const touchableProps = {
            key: idx,
            debugName: `Segmented Control ${debugName}, option ${o.label}`,
            onPress: onPress(o.value, idx),
            style: [widthStyle, variantStyles.button],
            ...props.touchableProps,

          }

          const textProps:TextProps = {
            text: o.label as string,
            colorChangeConfig: _animation,
            style: StyleSheet.flatten([variantStyles.text, selected && variantStyles['text:selected']]),
            animated: true,
            ...props.textProps,
          }

          if (RenderButton) {
            return (
              <RenderButton {...props} touchableProps={touchableProps} key={touchableProps.key} textProps={textProps} option={o}/>
            )
          }
          return <Touchable
            {...touchableProps}
            noFeedback={selected}
            key={touchableProps.key}
            styles={{
              feedback: variantStyles.buttonFeedback,
            }}
          >
            <Text

              {...textProps}
            />

          </Touchable>

        })}
      </View>
    </Scroll>
  </>
  )

})

type SegControlComponent = <T = string>(props: SegmentedControlProps<T> & {ref?: React.Ref<SegmentedControlRef>}) => ReactElement

export const SegmentedControl = _SegmentedControl as SegControlComponent
