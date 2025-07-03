import React from 'react'
import { TypeGuards } from '@codeleap/types'
import { onMount, useRef } from '@codeleap/hooks'
import { View } from '../View'
import { InputBase, selectInputBaseProps } from '../InputBase'
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
import { AnyRecord, IJSX, mergeStyles, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { useInputBase } from '../InputBase/useInputBase'
import { fields } from '@codeleap/form'
import { useInputBasePartialStyles } from '../InputBase/useInputBasePartialStyles'

export * from './styles'
export * from './types'

const DefaultSliderTrackMark = (props: TrackMarkProps) => {
  const { style } = props

  if (!TypeGuards.isString(props.content)) {
    return <React.Fragment>
      {props.content}
    </React.Fragment>
  }

  return <Text text={props.content} style={style} />
}

export const Slider = (props: SliderProps) => {
  const {
    inputBaseProps,
    others,
  } = selectInputBaseProps({
    ...Slider.defaultProps,
    ...props,
  })

  const {
    onValueChange,
    onValueCommit,
    value: _value,
    field,
    label,
    debugName,
    style,
    disabled,
    trackMarks,
    trackMarkComponent: SliderTrackMark = DefaultSliderTrackMark,
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

  const {
    wrapperRef,
    inputValue,
    onInputValueChange,
  } = useInputBase(field, fields.number, { value: _value, onValueChange })

  const isUniqueValue = !TypeGuards.isArray(inputValue)
  const value = isUniqueValue ? [inputValue] : inputValue

  const _defaultValue = TypeGuards.isArray(defaultSliderValue) ? defaultSliderValue : [defaultSliderValue]

  const defaultValueRef = useRef<PrimitiveSliderProps['defaultValue']>(_defaultValue)
  const defaultValue = defaultValueRef.current

  onMount(() => {
    if (_defaultValue?.length <= 0) {
      defaultValueRef.current = value
    }
  })

  const handleChange: SliderProps['onValueChange'] = (newValue: Array<number>) => {
    onInputValueChange?.(isUniqueValue ? newValue?.[0] : newValue)
  }

  const handleValueCommit = (newValue: Array<number>) => {
    onValueCommit?.(newValue)
  }

  const trackMarksHaveContent = !(TypeGuards.isArray(trackMarks) || TypeGuards.isNil(trackMarks))

  const trackMarksProp = React.useMemo(() => {
    if (!trackMarksHaveContent) {
      return trackMarks
    }
    return Object.keys(trackMarks).map((key) => Number(key))
  }, [trackMarksHaveContent])

  const partialStyles = useInputBasePartialStyles(
    styles,
    ['thumb', 'track', 'selectedTrack', 'unselectedTrack', 'sliderContainer', 'trackMark', 'trackMarkWrapper'],
    { disabled }
  )

  const trackStyle = React.useMemo(() => {
    return mergeStyles([partialStyles?.track, partialStyles.unselectedTrack])
  }, [partialStyles?.track, partialStyles.unselectedTrack])

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
      ref={wrapperRef}
      disabled={disabled}
      style={styles}
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
        style={partialStyles?.sliderContainer}
        value={value}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
      >
        <SliderTrack style={trackStyle}>
          <SliderRange style={partialStyles?.selectedTrack} />
        </SliderTrack>

        {defaultValue.map((_, i) => (
          <SliderThumb
            key={i}
            style={partialStyles?.thumb}
            onClick={() => {
              if (onPressThumbSetValue) onInputValueChange?.(value)
              if (TypeGuards.isFunction(onPressThumb)) onPressThumb?.(value, i)
            }}
          />
        ))}
      </SliderContainer>

      {trackMarksProp ?
        <View style={partialStyles?.trackMarkWrapper}>
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

              const style = mergeStyles([partialStyles?.trackMark, idxStyle])

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
  ...InputBase.elements,
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
