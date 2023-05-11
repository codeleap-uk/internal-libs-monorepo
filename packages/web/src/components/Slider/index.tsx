import * as React from 'react'
import { ComponentVariants, onMount, PropsOf, TypeGuards, useDefaultComponentStyle, useState } from '@codeleap/common'
import { SliderComposition } from './styles'
import { StylesOf } from '../../types'
import { View } from '../View'
import { concatStyles, InputBaseProps, InputBase, selectInputBaseProps } from '../InputBase'
import { SliderPresets } from './styles'
import { Text } from '../Text'

import { 
  Root as SliderContainer, 
  Track as SliderTrack, 
  Thumb as SliderThumb, 
  Range as SliderRange,
  SliderProps as PrimitiveSliderProps
} from '@radix-ui/react-slider'

export * from './styles'

export type SliderProps = Partial<Omit<PrimitiveSliderProps, 'value' | 'onValueChange'>> & Pick<InputBaseProps, 'disabled' | 'debugName' | 'description' | 'label'> & {
  debounce?: number | null
  indicatorLabel?: {
    order?: number[]
    separator?: string
    transformer?: (value: number[], breakpoints: Record<number, number>) => string
  }
  value: number[]
  onValueChange: (val: number[]) => void
  variants?: ComponentVariants<typeof SliderPresets>['variants']
  styles?: StylesOf<SliderComposition>
  style?: PropsOf<typeof View>['style']
  trackMarks?: Record<number, string>
  trackMarkComponent?: React.ComponentType<TrackMarkProps>
}

export type TrackMarkProps = {
  index: number
  content?: string | React.ReactNode
  style?: any
}

const DefaultSliderTrackMark = (props: TrackMarkProps) => {
  const { index, content, style } = props

  if(!TypeGuards.isString(props.content)){
    return <>
      {props.content}
    </>
  }

  return <Text 
    text={props.content}
    css={style}
  />
}

export const Slider = (props: SliderProps) => {
  const {
    inputBaseProps,
    others
  } = selectInputBaseProps(props)

  const {
    debounce = null,
    onValueChange,
    value,
    label,
    debugName,
    styles = {},
    style,
    disabled,
    variants,
    trackMarks,
    trackMarkComponent = DefaultSliderTrackMark,
    defaultValue: _defaultValue = [],
    max = 100,
    min = 0,
    indicatorLabel = null,
    description = null,
    ...sliderProps
  } = others

  const [defaultValue, _setDefaultValue] = useState(_defaultValue)

  onMount(() => {
    if (_defaultValue?.length <= 0) {
      _setDefaultValue(value)
    }
  })

  const SliderTrackMark = trackMarkComponent

  const breakpoints = React.useMemo(() => {
    if (defaultValue.length === 1) {
      return null
    }

    let _breakpoints = {}

    defaultValue.forEach((_value, i) => {
      const breakpoint = defaultValue[i + 1]
      
      _breakpoints = {
        ..._breakpoints,
        [i]: breakpoint ?? max
      }
    })

    return _breakpoints
  }, [defaultValue])

  const handleChange: SliderProps['onValueChange'] = (newValue) => {
    if (TypeGuards.isNil(breakpoints)) {
      onValueChange(newValue)
      return
    }

    const transformedValue = newValue?.map((value, i) => {
      if (Number(value) >= breakpoints[i]) {
        return breakpoints[i]
      } else {
        return value
      }
    })

    onValueChange(transformedValue)
  }

  const variantStyles = useDefaultComponentStyle<'u:Slider', typeof SliderPresets>('u:Slider', {
    variants,
    styles,
  })

  const thumbStyle = React.useMemo(() => {
    return concatStyles([
      variantStyles.thumb,
      disabled && variantStyles['thumb:disabled'],
    ])
  }, []) 

  const trackStyle = React.useMemo(() => {
    return concatStyles([
      variantStyles.track,
      disabled && variantStyles['track:disabled'],
      variantStyles.unselectedTrack,
      disabled && variantStyles['unselectedTrack:disabled'],
    ])  
  }, [disabled]) 

  const selectedTrackStyle = React.useMemo(() => {
    return concatStyles([
      variantStyles.selectedTrack,
      disabled && variantStyles['selectedTrack:disabled'],
    ])  
  }, [disabled])
  
  const containerStyle = React.useMemo(() => {
    return concatStyles([
      variantStyles.sliderContainer,
      disabled && variantStyles['sliderContainer:disabled'],
    ])
  }, [disabled])

  const trackMarksHaveContent = !(TypeGuards.isArray(trackMarks) || TypeGuards.isNil(trackMarks))

  const trackMarksProp = React.useMemo(() => {
    if(!trackMarksHaveContent){
      return trackMarks
    }
    return Object.keys(trackMarks).map((key) => Number(key))
  },[trackMarksHaveContent])

  const trackMarkStyle = React.useMemo(() => {
    return concatStyles([
      variantStyles.trackMark,
      disabled && variantStyles['trackMark:disabled'],
    ])
  }, [disabled])

  const trackMarkWrapperStyle = React.useMemo(() => {
    return [
      variantStyles.trackMarkWrapper,
      disabled && variantStyles['trackMarkWrapper:disabled'],
    ]
  }, [disabled])

  const sliderLabel = React.useMemo(() => {
    if (TypeGuards.isNil(indicatorLabel) || !indicatorLabel?.order && !indicatorLabel?.transformer) {
      return description
    }

    if (TypeGuards.isFunction(indicatorLabel?.transformer)) {
      const str = indicatorLabel?.transformer(value, breakpoints)
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
        ...variantStyles,
        innerWrapper: [
          variantStyles.innerWrapper,
        ],
      }}
      labelAsRow
      description={sliderLabel}
    >
      <SliderContainer
        step={1}
        {...sliderProps}
        style={containerStyle}
        defaultValue={defaultValue}
        value={value}
        onValueCommit={() => null}
        onValueChange={handleChange}
        min={min}
        max={max}
        disabled={disabled}
      >
        <SliderTrack style={trackStyle}>
          <SliderRange style={selectedTrackStyle} />
        </SliderTrack>

        {defaultValue.map((_thumbValue, i) => (
          <SliderThumb key={i} index={i} style={thumbStyle}/>
        ))}
      </SliderContainer>

      {trackMarksProp ?
          <View css={trackMarkWrapperStyle}>
            {
              trackMarksProp.map((_, idx) => {
                let idxStyle = {}

                const relativeValue = Number(trackMarksProp[idx])
    
                if(idx === 0){
                  idxStyle = variantStyles.firstTrackMark
                } else if(idx === trackMarksProp.length - 1){
                  idxStyle = variantStyles.lastTrackMark
                } else {
                  const markerPosition = relativeValue >= max ? 100 : (relativeValue / max) * 100

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
    
                if (!trackMarksHaveContent){
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

export * from './styles'
