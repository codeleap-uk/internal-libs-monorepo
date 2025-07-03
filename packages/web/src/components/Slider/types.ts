import { StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { SliderComposition } from './styles'
import { SliderProps as PrimitiveSliderProps } from '@radix-ui/react-slider'
import { CSSProperties } from 'react'
import { NumberField } from '@codeleap/form'

export type SliderProps = 
  Partial<Omit<PrimitiveSliderProps, 'value' | 'onValueChange' | 'style'>> &
  Pick<InputBaseProps, 'disabled' | 'debugName' | 'description' | 'label'> & 
  {
    indicatorLabel?: {
      order?: number[]
      separator?: string
      transformer?: (value: number[], defaultValue: PrimitiveSliderProps['defaultValue']) => string
    }
    field?: NumberField<any>
    value?: number | number[]
    onValueChange?: (val: number | number[]) => void
    style?: StyledProp<SliderComposition>
    trackMarks?: Record<number, string>
    trackMarkComponent?: React.ComponentType<TrackMarkProps>
    onPressThumbSetValue?: boolean
    onPressThumb?: (value: number | number[], thumbIndex: number) => void
  }

export type TrackMarkProps = {
  index: number
  content?: string | React.ReactNode
  style?: CSSProperties
}
