import { ComponentVariants, Form, SliderStyles } from '@codeleap/common'

import {
  SliderComposition,
} from './styles'

import { SliderProps as RNSliderProps } from '@miblanchard/react-native-slider/lib/types'
import { StylesOf } from '../../types'
import { ViewProps } from '../View'

export type SliderProps = Partial<Omit<RNSliderProps, 'value' | 'onValueChange'>> & {
    debounce?: number
    labels: string[]
    value: number
    valueOverThumb?: boolean
    showMarks?: boolean
    onValueChange: (val: number) => void
    label: Form.Label
    formatTooltip?: (val: number) => React.ReactNode
    variants?: ComponentVariants<typeof SliderStyles>['variants']
    styles?: StylesOf<SliderComposition>
    style?: ViewProps['style']
    tooltipVisibilityWindow?: number
}

export type SliderMarkProps = {
    sliderProps: SliderProps
    index: number
    styles: SliderProps['styles']
    variantStyles: SliderProps['styles']
}
