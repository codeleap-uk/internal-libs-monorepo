import { SliderComposition } from './styles'
import { SliderProps as RNSliderProps } from '@miblanchard/react-native-slider/lib/types'
import { InputBaseProps } from '../InputBase'
import { ICSS, StyledProp } from '@codeleap/styles'
import { MultiField } from '@codeleap/form'

export type SliderProps =
  Partial<Omit<RNSliderProps, 'value' | 'onValueChange' | 'style'>> &
  Pick<InputBaseProps, 'disabled' | 'debugName' | 'description' | 'label'> &
  {
    debounce?: number | null
    trackMarklabels?: string[]
    trackMarks?: RNSliderProps['trackMarks'] | Record<number, string>
    trackMarksClickable?: boolean
    labelClickable?: boolean
    trackMarkComponent?: React.ComponentType<TrackMarkProps>
    style?: StyledProp<SliderComposition>
    updateImmediately?: boolean
    field?: MultiField<number, any>
  }

export type TrackMarkProps = {
  index: number
  content?: string | React.ReactNode
  style?: ICSS | ICSS[]
  onPress?: () => void
}
