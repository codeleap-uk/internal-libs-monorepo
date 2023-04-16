import { ComponentVariants, Form, PropsOf, SliderStyles } from '@codeleap/common'

import {
  SliderComposition,
} from './styles'

import { SliderProps as RNSliderProps } from '@miblanchard/react-native-slider/lib/types'
import { StylesOf } from '../../types'
import { View } from '../View'
import { InputBaseProps } from '../InputBase'

export type SliderProps = Partial<Omit<RNSliderProps, 'value' | 'onValueChange'>> & Pick<InputBaseProps, 'disabled' | 'debugName' | 'description' | 'label'> & {
    debounce?: number | null
    trackMarklabels: string[]
    value: number | number[]
    onValueChange: (val: number) => void
    variants?: ComponentVariants<typeof SliderStyles>['variants']
    styles?: StylesOf<SliderComposition>
    style?: PropsOf<typeof View>['style']
    trackMarks?: RNSliderProps['trackMarks'] | Record<number, string>
    trackMarkComponent?: React.ComponentType<TrackMarkProps>
}

export type TrackMarkProps = {
  index: number
  content?: string | React.ReactNode
  style?: any
}