import React, { ReactElement, useImperativeHandle, useMemo, useRef } from 'react'
import { Scroll, ScrollProps } from '../Scroll'

import { EasingFunction, StyleSheet } from 'react-native'
import { PropsOf, useCodeleapContext, useDefaultComponentStyle } from '@codeleap/common'
import { SegmentedControlComposition, SegmentedControlStyles } from './styles'
import { Touchable } from '../Touchable'
import { StylesOf } from '../../types/utility'
import { Text } from '../Text'
import { KeyboardAwareScrollViewTypes } from '../../modules'
import { View } from '../View'
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
    styles?: StylesOf<SegmentedControlComposition>
    scrollProps?: any
    RenderButton?: (props: SegmentedControlProps & {
      touchableProps: PropsOf<typeof Touchable>
      textProps: PropsOf<typeof Text>
      option: {label: string; value: any}
    }) => ReactElement
    RenderAnimatedView?: (props: SegmentedControlProps) => ReactElement
}

const defaultAnimation = {
  duration: 200,
  // easing: Easing.linear,
}

const _SegmentedControl = React.forwardRef<SegmentedControlRef, SegmentedControlProps>((props, ref) => {
  const {
    options = [],
    onValueChange,
    debugName,
    value,
    styles = {},
    animation = {},
    variants = [],
    scrollProps = {},
    RenderAnimatedView,
    RenderButton,

  } = props
  const { Theme } = useCodeleapContext()

  const _animation = {
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
    const maxWordLength = Object.assign([], options)
      .sort((a, b) => {
        return a.label.length - b.label.length
      })[0].label.length
    const fitMaxWidth = Theme.values.width - Theme.spacing.value(4)
    let fitItemWidth = maxWordLength * options.length * 6
    if (fitItemWidth * options.length < fitMaxWidth) fitItemWidth = fitMaxWidth / options.length
    return { width: fitItemWidth }
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
  return (
    <Scroll
      horizontal
      showsHorizontalScrollIndicator={false}
      style={variantStyles.scroll}
      contentContainerStyle={variantStyles.scrollContent}
      {...scrollProps}
      ref={scrollRef}
    >
      <View style={variantStyles.wrapper}>
        <AnimatedView {...props}
          animated
          style={[variantStyles.selectedBubble, widthStyle]}
          animate={{
            translateX,
          }}

          transition={_animation}
        />
        {options.map((o, idx) => {
          const selected = value === o.value

          const touchableProps = {
            key: idx,
            debugName: `Segmented Control ${debugName}, option ${o.label}`,
            onPress: onPress(o.value, idx),
            style: [widthStyle, variantStyles.button],
          }

          const textProps = {
            text: o.label as string,
            colorChangeConfig: _animation,
            style: StyleSheet.flatten([variantStyles.text, selected && variantStyles['text:selected']]),
            animated: true,
          }

          if (RenderButton) {
            return (
              <RenderButton {...props} touchableProps={touchableProps} key={touchableProps.key} textProps={textProps} option={o}/>
            )
          }
          return <Touchable
            {...touchableProps}
            key={touchableProps.key}
          >
            <Text

              {...textProps}
            />

          </Touchable>

        })}
      </View>
    </Scroll>
  )

})

type SegControlComponent = <T = string>(props: SegmentedControlProps<T> & {ref?: React.Ref<SegmentedControlRef>}) => ReactElement

export const SegmentedControl = _SegmentedControl as SegControlComponent
