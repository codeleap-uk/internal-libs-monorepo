import { SliderMark } from './Mark'
import { ThumbTooltip } from './Thumb'
import * as React from 'react'
import { Slider as RNSlider } from '@miblanchard/react-native-slider'
import { StyleSheet } from 'react-native'
import {
  TypeGuards,
  useDefaultComponentStyle,
  onUpdate
} from '@codeleap/common'

import { SliderProps, TrackMarkProps } from './types'
import { InputBase, selectInputBaseProps } from '../InputBase'
import {SliderPresets} from './styles'
import { Text } from '../Text'
import { View } from '../View'

export * from './styles'



const DefaultSliderTrackMark = (props: TrackMarkProps) => {
  const { index, content, style } = props

  if(!TypeGuards.isString(props.content)){
    return <>
      {props.content}
    </>
  }

  return <Text 
    text={props.content}
    style={style}
  />
}

export const Slider = (props:SliderProps) => {
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
    ...sliderProps
  } = others

  const SliderTrackMark = trackMarkComponent
  const [_value, _setValue] = React.useState(value)

  onUpdate(() => {
    if(value !== _value){
      _setValue(value)
    }
  }, [value])



  const variantStyles = useDefaultComponentStyle<'u:Slider', typeof SliderPresets>('u:Slider', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })

  const thumbStyle = React.useMemo(() => {
    return StyleSheet.flatten([
      variantStyles.thumb,
      disabled && variantStyles['thumb:disabled'],
    ])  
  }, []) 

  const trackStyle = React.useMemo(() => {
    return StyleSheet.flatten([
      variantStyles.track,
      disabled && variantStyles['track:disabled'],
    ])  
  }, [disabled]) 

  const selectedTrackStyle = React.useMemo(() => {
    return StyleSheet.flatten([
      variantStyles.selectedTrack,
      disabled && variantStyles['selectedTrack:disabled'],
    ])  
  }, [disabled]) 

  const unselectedTrackStyle = React.useMemo(() => {
    return StyleSheet.flatten([
      variantStyles.unselectedTrack,
      disabled && variantStyles['unselectedTrack:disabled'],
    ])  
  }, [disabled])
  
  const containerStyle = React.useMemo(() => {
    return StyleSheet.flatten([
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
    return StyleSheet.flatten([
      variantStyles.trackMark,
      disabled && variantStyles['trackMark:disabled'],
    ])
  }, [disabled])

  return (
    <InputBase
      {...inputBaseProps}
      disabled={disabled}
      styles={variantStyles}
      labelAsRow
    >
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
        minimumValue={0}
        maximumValue={100}
        onSlidingComplete={() => {
          onValueChange(_value)
        }}
        disabled={disabled}
        {...sliderProps}
        trackMarks={trackMarksProp}
      />
      {
        trackMarksProp ? (
          <View style={variantStyles.trackMarkWrapper}>
          {
            trackMarksProp.map((_, idx) => {
              let idxStyle = {}

              if(idx === 0){
                idxStyle = variantStyles.firstTrackMark
              } else if(idx === trackMarksProp.length - 1){
                idxStyle = variantStyles.lastTrackMark
              }
              const style = [
                trackMarkStyle,
                idxStyle,
              ]

              if(!trackMarksHaveContent){
                return <SliderTrackMark 
                  index={idx} 
                  style={style}
                  key={idx}
                />
              }
              
              const relativeValue = trackMarksProp[idx]
              const content = trackMarks[relativeValue]
          
              return <SliderTrackMark index={idx} content={content} style={style} key={idx}/>
            })
          }
          </View>
        ) : null
      }
    </InputBase>    
  )
}

