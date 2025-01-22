import React from 'react'
import { Slider as RNSlider } from '@miblanchard/react-native-slider'
import { StyleSheet } from 'react-native'
import { TypeGuards } from '@codeleap/types'
import { onUpdate } from '@codeleap/hooks'
import { SliderProps, TrackMarkProps } from './types'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { Text } from '../Text'
import { View } from '../View'
import { Touchable } from '../Touchable'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

const DefaultSliderTrackMark = (props: TrackMarkProps) => {
  const { style, onPress } = props

  if (!TypeGuards.isString(props.content)) {
    return <>
      {props.content}
    </>
  }

  return <Text
    text={props.content}
    style={style}
    onPress={onPress}
  />
}

const minimumValue = 0
const maximumValue = 100

export const Slider = (props: SliderProps) => {
  const {
    inputBaseProps: { label: _label, description: _description, ..._inputBaseProps },
    others,
  } = selectInputBaseProps({
    ...Slider.defaultProps,
    ...props,
  })

  const {
    debounce = null,
    onValueChange,
    value,
    label,
    description,
    debugName,
    style,
    disabled,
    trackMarks,
    trackMarksClickable,
    labelClickable,
    updateImmediately = false,
    trackMarkComponent: SliderTrackMark,
    ...sliderProps
  } = others

  const [_value, _setValue] = updateImmediately ? [value, onValueChange] : React.useState(value)

  onUpdate(() => {
    if(updateImmediately) return
    if (value !== _value) {
      _setValue(value)
    }
  }, [value])

  const styles = useStylesFor(Slider.styleRegistryName, style)

  const thumbStyle = React.useMemo(() => {
    return StyleSheet.flatten([
      styles?.thumb,
      disabled && styles['thumb:disabled'],
    ])
  }, [])

  const trackStyle = React.useMemo(() => {
    return StyleSheet.flatten([
      styles?.track,
      disabled && styles['track:disabled'],
    ])
  }, [disabled])

  const selectedTrackStyle = React.useMemo(() => {
    return StyleSheet.flatten([
      styles?.selectedTrack,
      disabled && styles['selectedTrack:disabled'],
    ])
  }, [disabled])

  const unselectedTrackStyle = React.useMemo(() => {
    return StyleSheet.flatten([
      styles?.unselectedTrack,
      disabled && styles['unselectedTrack:disabled'],
    ])
  }, [disabled])

  const containerStyle = React.useMemo(() => {
    return StyleSheet.flatten([
      styles?.sliderContainer,
      disabled && styles['sliderContainer:disabled'],
    ])
  }, [disabled])

  const trackMarksHaveContent = !(TypeGuards.isArray(trackMarks) || TypeGuards.isNil(trackMarks))

  const trackMarksProp = React.useMemo(() => {
    if (!trackMarksHaveContent) {
      return trackMarks
    }
    return Object.keys(trackMarks).map((key) => Number(key))
  }, [trackMarksHaveContent])

  const trackMarkStyle = React.useMemo(() => {
    return StyleSheet.flatten([
      styles?.trackMark,
      disabled && styles['trackMark:disabled'],
    ])
  }, [disabled])

  return (
    <InputBase
      {..._inputBaseProps}
      disabled={disabled}
      style={styles}
      labelAsRow
    >
      {label || description ? (
        <View style={styles.labelRow}>
          {label ? (
            <Touchable
              onPress={() => labelClickable ? onValueChange(sliderProps?.minimumValue || minimumValue) : null}
              style={styles.labelBtn}
              debugName='slider title'
            >
              <Text style={styles?.label} text={label} />
            </Touchable>
          ) : null}
          {description ? (
            <Touchable
              onPress={() => labelClickable ? onValueChange(sliderProps?.maximumValue || maximumValue) : null}
              style={styles?.descriptionBtn}
              debugName='slider description'
            >
              <Text style={styles?.description} text={description} />
            </Touchable>
          ) : null}
        </View>
      ) : null}

      <RNSlider
        value={_value}
        onValueChange={_setValue}
        // @ts-ignore
        thumbStyle={thumbStyle}
        // @ts-ignore
        trackStyle={trackStyle}
        minimumTrackStyle={selectedTrackStyle}
        maximumTrackStyle={unselectedTrackStyle}
        containerStyle={containerStyle}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        onSlidingComplete={() => {
          if(updateImmediately) return
          onValueChange(_value)
        }}
        disabled={disabled}
        {...sliderProps}
        trackMarks={trackMarksProp}
      />
      {
        trackMarksProp ? (
          <View style={styles?.trackMarkWrapper}>
            {
              trackMarksProp.map((_, idx) => {
                let idxStyle = {}

                if (idx === 0) {
                  idxStyle = styles?.firstTrackMark
                } else if (idx === trackMarksProp.length - 1) {
                  idxStyle = styles?.lastTrackMark
                }

                const style = [
                  trackMarkStyle,
                  idxStyle,
                ]

                if (!trackMarksHaveContent) {
                  return <SliderTrackMark
                    index={idx}
                    style={style}
                    key={idx}
                    onPress={() => trackMarksClickable ? onValueChange(trackMarksProp[idx]) : null}
                  />
                }

                const relativeValue = trackMarksProp[idx]
                const content = trackMarks[relativeValue]

                return <SliderTrackMark
                  index={idx}
                  content={content}
                  style={style}
                  key={idx}
                  onPress={() => trackMarksClickable ? onValueChange(trackMarksProp[idx]) : null}
                />
              })
            }
          </View>
        ) : null
      }
    </InputBase>
  )
}

Slider.styleRegistryName = 'Slider'
Slider.rootElement = 'wrapper'
Slider.elements = [
  ...InputBase.elements,
  'thumb',
  'track',
  'selectedTrack',
  'unselectedTrack',
  'firstTrackMark',
  'lastTrackMark',
  'sliderContainer',
  'labelBtn',
  'descriptionBtn',
]

Slider.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Slider as (props: StyledComponentProps<SliderProps, typeof styles>) => IJSX
}

Slider.defaultProps = {
  trackMarksClickable: false,
  labelClickable: false,
  trackMarkComponent: DefaultSliderTrackMark,
} as Partial<SliderProps>

MobileStyleRegistry.registerComponent(Slider)
