import { SliderMark } from './Mark'
import { ThumbTooltip } from './Thumb'
import * as React from 'react'
import { Slider as RNSlider } from '@miblanchard/react-native-slider'

import { useRef } from 'react'
import { StyleSheet } from 'react-native'
import { View } from '../View'
import {
  getNestedStylesByKey,
  useDefaultComponentStyle,
} from '@codeleap/common'

import { SliderProps } from './types'
import { InputLabel } from '../InputLabel'
import { SliderStyles } from './styles'

export * from './styles'

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
    tooltipVisibilityWindow = 830,
    variants,
    ...props
  } = sliderProps

  const changeDebounce = typeof debounce === 'number' ? debounce : 100

  const debounceTimeout = useRef(null)
  const toggleTooltipTimeout = useRef(null)
  const valueRef = useRef(value)

  const variantStyles = useDefaultComponentStyle<'u:Slider', typeof SliderStyles>('u:Slider', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })

  function setValue() {
    onValueChange(valueRef.current)
  }

  function onChange(val) {
    let eventValue = val

    if (Array.isArray(val) && typeof value === 'number') {
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
      <InputLabel label={label} styles={getNestedStylesByKey('label', variantStyles)} />
      <RNSlider
        value={value}
        onSlidingStart={() => {
          if (toggleTooltipTimeout.current) { clearTimeout(toggleTooltipTimeout.current) }

          setTooltipVisible(true)
        }}
        onSlidingComplete={() => {
          toggleTooltipTimeout.current = setTimeout(
            () => setTooltipVisible(false),
            tooltipVisibilityWindow,
          )
        }}
        onValueChange={onChange}
        renderAboveThumbComponent={(idx) => {
          if (!valueOverThumb) return null
          const thisValue = Array.isArray(value) ? value[idx] : value
          return (
            <ThumbTooltip
              visible={tooltipVisible}
              variantStyles={variantStyles}
              styles={styles}
            >
              {formatTooltip ? formatTooltip(thisValue) : thisValue.toString()}
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
            [variantStyles.inputContainer] as any
        }
        thumbStyle={
            StyleSheet.flatten([variantStyles.handle]) as any
        }
        trackStyle={[variantStyles.track] as any}
        minimumTrackTintColor={
          StyleSheet.flatten([
            variantStyles.selectedTrack,

          ])?.backgroundColor
        }
        {...props}
      />
    </View>
  )
}

