import { ElementType } from 'react'
import { ViewProps } from '.'
import {View} from './View'
import { CSSObject, keyframes } from '@emotion/react'
import { useStyle } from '@codeleap/common'
export type ActivityIndicatorProps<T extends ElementType> = {
    animating?:boolean
    hidesWhenStopped?:boolean
    color?:string
    size?: number|string
} & ViewProps<T>

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to{ 
        transform: rotate(360deg);
    }
`

export const ActivityIndicator = <T extends ElementType = 'div'>(indicatorProps :ActivityIndicatorProps<T>) => {
  const { animating = true, hidesWhenStopped = true, color = '', size = '2em', css, _ig_children, ...viewProps} = indicatorProps

  const {Theme} = useStyle()
  if (!animating && hidesWhenStopped){
    return null
  }
  const actualColor = color || Theme?.colors?.primary || '#000'
  const borderWidth = Theme.spacing.base/2
  const commonStyle:CSSObject = {
   
    height: size,
    width: size,
    borderRadius: 100,
    position: 'absolute',
    ...Theme.presets.whole,
    ...css,
  }
  return <View {...viewProps} css={{
    position: 'relative',
    height: size,
    width: size,
  }}>
    <View css={{
      ...commonStyle,
      border: `${borderWidth}px solid ${actualColor}`,
      opacity: 0.5,
    }}/>
    <View css={{
      ...commonStyle,
      border: `${borderWidth}px solid transparent`,
      borderTopColor: actualColor,  
      animation: `${spin} 1s infinite`, 
      animationPlayState: animating ? 'running' :  'paused',
    }}/>
  </View>
}
