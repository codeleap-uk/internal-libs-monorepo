import React, { ReactElement, useImperativeHandle, useMemo, useRef, useState, Ref } from 'react'
import { Easing, ScrollView } from 'react-native'
import { Text } from '../Text'
import { View } from '../View'
import { useAnimatedVariantStyles } from '../../utils'
import { SegmentedControlOption } from './Option'
import { SegmentedControlProps, SegmentedControlRef } from './types'
import { AnyRecord, GenericStyledComponentAttributes, IJSX, StyledComponentProps, themeStore } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'

export * from './styles'
export * from './types'

const DefaultBubble = (props) => {
  return <View animated {...props} />
}

const defaultAnimation = {
  type: 'timing',
  duration: 200,
  easing: Easing.linear,
}

export const SegmentedControl = React.forwardRef<SegmentedControlRef, SegmentedControlProps>((props, ref) => {
  const theme = themeStore(store => store.current) as any

  const {
    options = [],
    onValueChange,
    debugName,
    label,
    value,
    animation = {},
    scrollProps = {},
    getItemWidth = () => (theme?.values?.width - theme?.spacing?.value?.(4)) / options.length,
    renderBubble,
    scrollToCurrentOptionOnMount,
    renderOption,
    touchableProps,
    style,
    ...viewProps
  } = {
    ...SegmentedControl.defaultProps,
    ...props,
  }

  const [bubbleWidth, setBubbleWidth] = useState(0)

  const _animation = {
    ...defaultAnimation,
    ...animation,
  }

  const styles = MobileStyleRegistry.current.styleFor(SegmentedControl.styleRegistryName, style)

  const scrollRef = useRef<SegmentedControlRef>(null)

  function scrollTo(idx: number) {
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

  const onPress = (txt: string, idx: number) => {
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

  const bubbleAnimation = useAnimatedVariantStyles({
    variantStyles: styles,
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

  return (
    <View style={styles?.wrapper}>
      <View {...viewProps} style={styles?.labelWrapper}>
        <Text style={styles?.labelText} text={label} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles?.scroll}
        contentContainerStyle={styles?.scrollContent}
        {...scrollProps}
        ref={scrollRef as unknown as Ref<ScrollView>}
      >
        <View style={styles?.innerWrapper}>
          <BubbleView
            options={options}
            animated
            animatedStyle={bubbleAnimation}
            style={[
              styles?.selectedBubble,
              props?.touchableProps?.disabled && styles?.['selectedBubble:disabled'],
              widthStyle,
            ]}
          />
          {options.map((o, idx) => (
            <Option
              debugName={debugName}
              label={o.label}
              value={o.value}
              icon={o.icon}
              onPress={onPress(o.value, idx)}
              key={idx}
              style={widthStyle}
              selected={value === o.value}
              variantStyles={styles}
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
              {...touchableProps}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}) as unknown as (<T = string>(props: SegmentedControlProps<T> & { ref?: React.Ref<SegmentedControlRef> }) => ReactElement) & {
  defaultProps: Partial<SegmentedControlProps>
} & GenericStyledComponentAttributes<AnyRecord>

SegmentedControl.styleRegistryName = 'SegmentedControl'
SegmentedControl.elements = ['wrapper', 'selectedBubble', 'innerWrapper', 'scroll', 'text', 'icon', 'button', 'label', 'badge']
SegmentedControl.rootElement = 'scroll'

SegmentedControl.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return SegmentedControl as (<T = string>(props: StyledComponentProps<SegmentedControlProps<T> & { ref?: React.Ref<SegmentedControlRef> }, typeof styles>) => IJSX)
}

SegmentedControl.defaultProps = {
  renderBubble: DefaultBubble,
  renderOption: SegmentedControlOption,
  scrollToCurrentOptionOnMount: true
}

MobileStyleRegistry.registerComponent(SegmentedControl)
