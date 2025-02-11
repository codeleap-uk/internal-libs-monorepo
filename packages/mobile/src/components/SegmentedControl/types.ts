import { ScrollProps, ScrollRef } from '../Scroll'
import { SegmentedControlOptionProps } from './Option'
import { TransitionConfig } from '../../utils'
import { TextProps } from '../Text'
import { TouchableProps } from '../Touchable'
import { FormTypes } from '@codeleap/form'
import { StyledProp } from '@codeleap/styles'
import { SegmentedControlComposition, ViewProps } from '../components'

export type SegmentedControlRef = ScrollRef & {
  scrollTo: (index: number) => void
  scrollToCurrent: () => void
}

export type SegmentedControlProps<T = string> =
  Omit<ScrollProps, 'style'> &
  {
    options: SegmentedControlOptionProps[]
    onValueChange: (value: T) => any
    value: T
    debugName: string
    animation?: TransitionConfig
    animated?: boolean
    animatedStyle?: ViewProps['animatedStyle']
    textProps?: Partial<TextProps>
    touchableProps?: Partial<TouchableProps>
    label?: FormTypes.Label
    renderOption?: (props: SegmentedControlOptionProps) => JSX.Element
    renderBubble?: (props: Partial<SegmentedControlProps>) => JSX.Element
    getItemWidth?: (item: { label: string; value: T }, idx: number, arr: { label: string; value: T }[]) => number
    scrollToCurrentOptionOnMount?: boolean
    style?: StyledProp<SegmentedControlComposition>
  }
