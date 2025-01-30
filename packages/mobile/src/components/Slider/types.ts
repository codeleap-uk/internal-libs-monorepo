import { SliderComposition } from './styles'
import { SliderProps as RNSliderProps } from '@miblanchard/react-native-slider/lib/types'
import { InputBaseProps } from '../InputBase'
import { StyledProp } from '@codeleap/styles'

export type SliderProps =
  Partial<Omit<RNSliderProps, 'value' | 'onValueChange' | 'style'>> &
  Pick<InputBaseProps, 'disabled' | 'debugName' | 'description' | 'label'> &
  {
    debounce?: number | null
    trackMarklabels: string[]
    value: number | number[]
    onValueChange: (val: number | number[]) => void
    trackMarks?: RNSliderProps['trackMarks'] | Record<number, string>
    trackMarksClickable?: boolean
    labelClickable?: boolean
    trackMarkComponent?: React.ComponentType<TrackMarkProps>
    style?: StyledProp<SliderComposition>
    updateImmediately?: boolean
  }

export type TrackMarkProps = {
  index: number
  content?: string | React.ReactNode
  style?: any
  onPress?: () => void
}
