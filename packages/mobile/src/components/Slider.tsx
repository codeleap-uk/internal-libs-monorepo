import * as React from 'react'
import { Slider as RNSlider } from '@miblanchard/react-native-slider'
import { SliderProps as RNSliderProps } from '@miblanchard/react-native-slider/lib/types'
import { useRef } from 'react'
import { StyleProp, StyleSheet } from 'react-native'
import { Text } from './Text'
import { View, ViewProps } from './View'
import {
  ComponentVariants,
  Form,
  SliderComposition,
  SliderStyles,
  useComponentStyle,
  useStyle,
} from '@codeleap/common'
import { InputLabel } from './TextInput'
import { StylesOf } from '../types/utility'

type SliderProps = Partial<Omit<RNSliderProps, 'value' | 'onValueChange'>> & {
  debounce?: number;
  labels: string[];
  value: number;
  valueOverThumb?: boolean;
  showMarks?: boolean;
  onValueChange: (val: number) => void;
  label: Form.Label;
  formatTooltip?: (val: number) => React.ReactNode;
  variants?: ComponentVariants<typeof SliderStyles>['variants'];
  styles?: StylesOf<SliderComposition>;
  style?: ViewProps['style'];
};

type SliderMarkProps = {
  sliderProps: SliderProps;
  index: number;
  styles: SliderProps['styles'];
  variantStyles: SliderProps['styles'];
};

const SliderMark: React.FC<SliderMarkProps> = ({
  index,
  sliderProps,
  styles,
  variantStyles,
}) => {
  const { labels = [], showMarks } = sliderProps

  const l = labels?.[index] || ''

  const isFirst = index === 0
  const isLast = index === labels.length - 1

  const centerAdjustWord = -(l.length * 2)

  const markStyles: StyleProp<any> = {}

  const labelStyles: StyleProp<any> = {}

  if (!isFirst && !isLast) {
    labelStyles.left = centerAdjustWord
  }

  if (isLast) {
    labelStyles.right = -20
    markStyles.right = -10
  }
  return (
    <>
      {showMarks ? (
        <View style={[markStyles, variantStyles.mark, styles.mark]} />
      ) : null}
      {l ? (
        <Text
          style={[labelStyles, variantStyles.trackLabels, styles.trackLabels]}
          text={l}
        />
      ) : null}
    </>
  )
}

const ThumbTooltip = ({ children, visible, styles, variantStyles }) => {
  return (
    <View
      style={[
        StyleSheet.flatten([variantStyles.tooltip, styles.tooltip]),
        visible
          ? StyleSheet.flatten([
            variantStyles['tooltip:visible'],
            styles['tooltip:visible'],
          ])
          : StyleSheet.flatten([
            variantStyles['tooltip:hidden'],
            styles['tooltip:hidden'],
          ]),
      ]}
    >
      <Text
        style={[variantStyles.tooltipText, styles.tooltipText]}
        text={children}
      />
      <View style={[variantStyles.tooltipArrow, styles.tooltipArrow]} />
    </View>
  )
}

export const Slider: React.FC<SliderProps> = (sliderProps) => {
  const [tooltipVisible, setTooltipVisible] = React.useState(false)

  const {
    debounce,
    onValueChange,
    labels,
    value,
    label,
    valueOverThumb,
    formatTooltip,
    styles = {},
    style,
    variants,
    ...props
  } = sliderProps

  const changeDebounce = typeof debounce === 'number' ? debounce : 100

  const debounceTimeout = useRef(null)
  const toggleTooltipTimeout = useRef(null)
  const valueRef = useRef(value)

  const variantStyles = useComponentStyle('Slider', {
    variants,
  })

  function setValue() {
    onValueChange(valueRef.current)
  }

  function onChange(val) {
    let eventValue = val

    if (Array.isArray(val)) {
      eventValue = val[0]
    }

    if (eventValue === value) return

    valueRef.current = eventValue as number

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)

    debounceTimeout.current = setTimeout(() => {
      setValue()
    }, changeDebounce)
  }

  return (
    <View style={[variantStyles.wrapper, style]}>
      <InputLabel label={label} style={[variantStyles.label, styles.label]} />
      <RNSlider
        value={value}
        onSlidingStart={() => {
          if (toggleTooltipTimeout.current) { clearTimeout(toggleTooltipTimeout.current) }

          setTooltipVisible(true)
        }}
        onSlidingComplete={() => {
          toggleTooltipTimeout.current = setTimeout(
            () => setTooltipVisible(false),
            830,
          )
        }}
        onValueChange={onChange}
        renderAboveThumbComponent={(idx) => {
          if (!valueOverThumb || typeof value !== 'number') return null

          return (
            <ThumbTooltip
              visible={tooltipVisible}
              variantStyles={variantStyles}
              styles={styles}
            >
              {formatTooltip ? formatTooltip(value) : value.toString()}
            </ThumbTooltip>
          )
        }}
        renderTrackMarkComponent={(idx) => (
          <SliderMark
            index={idx}
            sliderProps={sliderProps}
            styles={styles}
            variantStyles={variantStyles}
          />
        )}
        maximumValue={labels ? labels.length - 1 : 10}
        trackMarks={labels ? Object.keys(labels).map((z) => parseInt(z)) : []}
        containerStyle={
          [variantStyles.inputContainer, styles.inputContainer] as any
        }
        thumbStyle={
          StyleSheet.flatten([variantStyles.handle, styles.handle]) as any
        }
        trackStyle={[variantStyles.track, styles.track] as any}
        minimumTrackTintColor={
          StyleSheet.flatten([
            variantStyles.selectedTrack,
            styles.selectedTrack,
          ])?.backgroundColor
        }
        {...props}
      />
    </View>
  )
}
