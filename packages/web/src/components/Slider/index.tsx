/** @jsx jsx */
import React from 'react'
import { onMount, TypeGuards, useRef } from '@codeleap/common'
import { View } from '../View'
import { concatStyles, InputBase, selectInputBaseProps } from '../InputBase'
import { Text } from '../Text'
import {
  Root as SliderContainer,
  Track as SliderTrack,
  Thumb as SliderThumb,
  Range as SliderRange,
  SliderProps as PrimitiveSliderProps,
} from '@radix-ui/react-slider'
import { SliderProps, TrackMarkProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib'

const DefaultSliderTrackMark = (props: TrackMarkProps) => {
  const { style } = props

  if (!TypeGuards.isString(props.content)) {
    return <React.Fragment>
      {props.content}
    </React.Fragment>
  }

  return <Text
    text={props.content}
    style={style}
  />
}

export const Slider = (props: SliderProps) => {

  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps({ ...Slider.defaultProps, ...props })

  const {
    onValueChange,
    onValueCommit,
    value: _value,
    label,
    debugName,
    style,
    disabled,
    trackMarks,
    trackMarkComponent = DefaultSliderTrackMark,
    max,
    min,
    defaultValue: defaultSliderValue,
    indicatorLabel,
    description,
    minStepsBetweenThumbs,
    step,
    onPressThumbSetValue,
    onPressThumb,
    ...sliderProps
  } = others

  const styles = useStylesFor(Slider.styleRegistryName, style)

  const isUniqueValue = !TypeGuards.isArray(_value)
  const value = isUniqueValue ? [_value] : _value

  const _defaultValue = TypeGuards.isArray(defaultSliderValue) ? defaultSliderValue : [defaultSliderValue]

  const defaultValueRef = useRef<PrimitiveSliderProps['defaultValue']>(_defaultValue)
  const defaultValue = defaultValueRef.current

  onMount(() => {
    if (_defaultValue?.length <= 0) {
      defaultValueRef.current = value
    }
  })

  const SliderTrackMark = trackMarkComponent

  const handleChange: SliderProps['onValueChange'] = (newValue: Array<number>) => {
    onValueChange(isUniqueValue ? newValue?.[0] : newValue)
  }

  const handleValueCommit = (newValue: Array<number>) => {
    onValueCommit?.(newValue)
  }

  const thumbStyle = React.useMemo(() => {
    return concatStyles([
      styles.thumb,
      disabled && styles['thumb:disabled'],
    ])
  }, [])

  const trackStyle = React.useMemo(() => {
    return concatStyles([
      styles.track,
      disabled && styles['track:disabled'],
      styles.unselectedTrack,
      disabled && styles['unselectedTrack:disabled'],
    ])
  }, [disabled])

  const selectedTrackStyle = React.useMemo(() => {
    return concatStyles([
      styles.selectedTrack,
      disabled && styles['selectedTrack:disabled'],
    ])
  }, [disabled])

  const containerStyle = React.useMemo(() => {
    return concatStyles([
      styles.sliderContainer,
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
    return concatStyles([
      styles.trackMark,
      disabled && styles['trackMark:disabled'],
    ])
  }, [disabled])

  const trackMarkWrapperStyle = React.useMemo(() => {
    return [
      styles.trackMarkWrapper,
      disabled && styles['trackMarkWrapper:disabled'],
    ]
  }, [disabled])

  const sliderLabel = React.useMemo(() => {
    if (TypeGuards.isNil(indicatorLabel) || !indicatorLabel?.order && !indicatorLabel?.transformer) {
      return description
    }

    if (TypeGuards.isFunction(indicatorLabel?.transformer)) {
      const str = indicatorLabel?.transformer(value, defaultValue)
      return str
    } else if (TypeGuards.isArray(indicatorLabel?.order)) {
      let str = ''

      indicatorLabel?.order?.forEach((idx, i) => {
        const valueLabel = value[idx]

        if (TypeGuards.isNil(valueLabel)) return

        str = i === 0 ? String(valueLabel) : `${str}${indicatorLabel?.separator ?? ' - '}${valueLabel}`
      })

      return str
    } else {
      return description
    }
  }, [value])

  return (
    <InputBase
      {...inputBaseProps}
      disabled={disabled}
      styles={{
        ...styles,
        innerWrapper: [
          styles.innerWrapper,
        ],
      }}
      labelAsRow
      description={sliderLabel}
    >
      <SliderContainer
        {...sliderProps}
        step={step}
        min={min}
        max={max}
        disabled={disabled}
        defaultValue={defaultValue}
        onValueCommit={handleValueCommit}
        onValueChange={handleChange}
        style={containerStyle}
        value={value}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
      >
        <SliderTrack style={trackStyle}>
          <SliderRange style={selectedTrackStyle} />
        </SliderTrack>

        {defaultValue.map((_, i) => (
          <SliderThumb
            key={i}
            style={thumbStyle}
            onClick={() => {
              if (onPressThumbSetValue) onValueChange?.(value)
              if (TypeGuards.isFunction(onPressThumb)) onPressThumb?.(value, i)
            }}
          />
        ))}
      </SliderContainer>

      {trackMarksProp ?
        <View style={trackMarkWrapperStyle}>
          {
            trackMarksProp.map((_, idx) => {
              let idxStyle = {}

              const relativeValue = Number(trackMarksProp[idx])

              if (idx === 0) {
                idxStyle = styles.firstTrackMark
              } else if (idx === trackMarksProp.length - 1) {
                idxStyle = styles.lastTrackMark
              } else {
                const markerPosition = (relativeValue / max) * 100

                idxStyle = {
                  position: 'absolute',
                  left: `${markerPosition}%`,
                  top: '50%',
                  transform: `translate(-50%, -50%)`,
                }
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
                />
              }

              const content = trackMarks[relativeValue]

              return (
                <SliderTrackMark
                  index={idx}
                  content={content}
                  style={style}
                  key={idx}
                />
              )
            })
          }
        </View>
        : null}
    </InputBase>
  )
}

Slider.styleRegistryName = 'Slider'

Slider.elements = [
  'wrapper',
  'innerWrapper',
  'label',
  'errorMessage',
  'description',
  'labelRow',
  'thumb',
  'track',
  'selectedTrack',
  'unselectedTrack',
  'trackMark',
  'firstTrackMark',
  'lastTrackMark',
  'trackMarkWrapper',
  'sliderContainer',
]

Slider.rootElement = 'wrapper'

Slider.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Slider as (props: StyledComponentProps<SliderProps, typeof styles>) => IJSX
}

Slider.defaultProps = {
  max: 100,
  min: 0,
  minStepsBetweenThumbs: 0,
  defaultValue: [],
  indicatorLabel: null,
  description: null,
  step: 1,
  onPressThumbSetValue: false,
  onPressThumb: null,
} as Partial<SliderProps>

WebStyleRegistry.registerComponent(Slider)

export * from './styles'
export * from './types'
