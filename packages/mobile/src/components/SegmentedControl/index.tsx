import React, { ReactElement, useImperativeHandle, useMemo, useRef } from 'react'
import { Scroll, ScrollProps, ScrollRef } from '../Scroll'

import { Easing, StyleSheet } from 'react-native'
import { FormTypes, getNestedStylesByKey, PropsOf, useCodeleapContext, useDefaultComponentStyle, useState } from '@codeleap/common'
import { SegmentedControlComposition, SegmentedControlPresets } from './styles'
import { Touchable } from '../Touchable'
import { StylesOf } from '../../types/utility'
import { Text } from '../Text'
import { View } from '../View'
import { InputLabel } from '../InputLabel'
import { useAnimatedVariantStyles, TransitionConfig } from '../../utils'
import { SegmentedControlOption } from './Option'
import { SegmentedControlOptionProps } from './Option'

export * from './styles'

export type SegmentedControlRef = ScrollRef & {
  scrollTo: (index: number) => void
  scrollToCurrent: () => void
}

const DefaultBubble = (props:Partial<SegmentedControlProps>) => {
  const {
    style,

  } = props
  return <View
    animated
    style={style}
  />
}

export type SegmentedControlProps<T = string> = ScrollProps & {
    options : {label: string; value: T }[]
    onValueChange: (value: T) => any
    value: T
    debugName: string
    animation?: TransitionConfig
    textProps?: Partial<PropsOf<typeof Text>>
    touchableProps?: Partial<PropsOf<typeof Touchable>>
    styles?: StylesOf<SegmentedControlComposition>
    scrollProps?: any
    label?: FormTypes.Label
    renderOption?: (props: SegmentedControlOptionProps) => JSX.Element
    renderBubble?: (props: Partial<SegmentedControlProps>) => JSX.Element
    getItemWidth?: (item:{label: string; value: T }, idx: number, arr: {label: string; value: T }[]) => number
    scrollToCurrentOptionOnMount?: boolean
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
    getItemWidth,
    renderBubble,
    scrollToCurrentOptionOnMount = true,
    renderOption,
  } = {
    ...(_SegmentedControl.defaultProps || {}),
    ...props,
  }

  const [bubbleWidth, setBubbleWidth] = useState(0)

  const _animation = {
    ...defaultAnimation, ...animation,
  }

  let variantStyles = useDefaultComponentStyle<'u:SegmentedControl', typeof SegmentedControlPresets>('u:SegmentedControl', {
    styles,
    transform: StyleSheet.flatten,
    variants,
    rootElement: 'scroll',
  })

  const scrollRef = useRef<SegmentedControlRef>(null)

  function scrollTo(idx:number) {
    if (!scrollRef.current) return
    setTimeout(() => {
      scrollRef.current?.scrollToPosition?.(widthStyle.width * idx, 0, true)
    })
  }

  const widthStyle = useMemo(() => {
    if (getItemWidth) {
      const sizes = options.map(getItemWidth)
      const maxWidth = sizes.sort((a, b) => b - a)[0]

      return { width: maxWidth }

    }

    return {
      width: bubbleWidth,
    }
  }, [options, bubbleWidth])

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
  }, [
    currentOptionIdx,
  ])

  if (!hasScrolledInitially.current && scrollRef.current && scrollToCurrentOptionOnMount) {
    scrollTo(currentOptionIdx)
    hasScrolledInitially.current = true
  }

  const BubbleView = renderBubble
  const Option = renderOption

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

  const largestWidth = useRef(0)

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
          style={[
            variantStyles.selectedBubble,
            props?.touchableProps?.disabled && variantStyles['selectedBubble:disabled'],
            widthStyle,
            bubbleAnimation,
          ]}
        />
        {options.map((o, idx) => (
          <Option
            debugName={debugName}
            label={o.label}
            value={o.value}
            onPress={onPress(o.value, idx)}
            key={idx}
            style={widthStyle}
            selected={value === o.value}
            variantStyles={variantStyles}
            onLayout={e => {
              const { width } = e.nativeEvent.layout
              if (width > largestWidth.current) {
                largestWidth.current = width
              }

              if (idx === options.length - 1) {
                setBubbleWidth(largestWidth.current)
                largestWidth.current = 0
              }
            }}
          />
        ))}
      </View>
    </Scroll>
  </View>
  )

})

_SegmentedControl.defaultProps = {
  renderBubble: DefaultBubble,
  renderOption: SegmentedControlOption,
}

type SegControlComponent = <T = string>(props: SegmentedControlProps<T> & {ref?: React.Ref<SegmentedControlRef>}) => ReactElement

export const SegmentedControl = _SegmentedControl as SegControlComponent
