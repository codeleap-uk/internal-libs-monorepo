import React from 'react'
import { Slider as RNSlider } from '@miblanchard/react-native-slider'
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
import { useInputBase } from '../InputBase/useInputBase'
import { fields } from '@codeleap/form'
import { useInputBasePartialStyles } from '../InputBase/useInputBasePartialStyles'

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
    field,
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
    value,
    onValueChange,
    ...sliderProps
  } = others

  const {
    wrapperRef,
    inputValue,
    onInputValueChange,
  } = useInputBase(field, fields.number, { value, onValueChange })

  const [_value, _setValue] = updateImmediately ? [inputValue, onInputValueChange] : React.useState<number | Array<number>>(0)

  onUpdate(() => {
    if (updateImmediately) return
    if (inputValue !== _value) {
      _setValue(inputValue)
    }
  }, [inputValue])

  const styles = useStylesFor(Slider.styleRegistryName, style)

  const partialStyles = useInputBasePartialStyles(
    styles,
    ['thumb', 'track', 'selectedTrack', 'unselectedTrack', 'sliderContainer', 'trackMark'],
    { disabled }
  )

  const trackMarksHaveContent = !(TypeGuards.isArray(trackMarks) || TypeGuards.isNil(trackMarks))

  const trackMarksProp = React.useMemo(() => {
    if (!trackMarksHaveContent) {
      return trackMarks
    }
    return Object.keys(trackMarks).map((key) => Number(key))
  }, [trackMarksHaveContent])

  return (
    <InputBase
      {..._inputBaseProps}
      ref={wrapperRef}
      disabled={disabled}
      style={styles}
      labelAsRow
    >
      {label || description ? (
        <View style={styles.labelRow}>
          {label ? (
            <Touchable
              onPress={() => labelClickable ? onInputValueChange(sliderProps?.minimumValue || minimumValue) : null}
              style={styles.labelBtn}
              debugName='slider title'
            >
              <Text style={styles?.label} text={label} />
            </Touchable>
          ) : null}
          {description ? (
            <Touchable
              onPress={() => labelClickable ? onInputValueChange(sliderProps?.maximumValue || maximumValue) : null}
              style={styles?.descriptionBtn}
              debugName='slider description'
            >
              <Text style={styles?.description} text={description} />
            </Touchable>
          ) : null}
        </View>
      ) : null}

      {/* @ts-ignore */}
      <RNSlider
        value={_value}
        onValueChange={_setValue}
        thumbStyle={partialStyles?.thumb}
        trackStyle={partialStyles?.track}
        minimumTrackStyle={partialStyles?.selectedTrack}
        maximumTrackStyle={partialStyles?.unselectedTrack}
        containerStyle={partialStyles?.sliderContainer}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        onSlidingComplete={() => {
          if (updateImmediately) return
          onInputValueChange(_value)
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

                const style = [partialStyles?.trackMark, idxStyle]

                if (!trackMarksHaveContent) {
                  return <SliderTrackMark
                    index={idx}
                    style={style}
                    key={idx}
                    onPress={() => trackMarksClickable ? onInputValueChange(trackMarksProp[idx]) : null}
                  />
                }

                const relativeValue = trackMarksProp[idx]
                const content = trackMarks[relativeValue]

                return <SliderTrackMark
                  index={idx}
                  content={content}
                  style={style}
                  key={idx}
                  onPress={() => trackMarksClickable ? onInputValueChange(trackMarksProp[idx]) : null}
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
