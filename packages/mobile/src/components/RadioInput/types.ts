import { StyledProp } from '@codeleap/styles'
import { RadioInputComposition } from './styles'
import { InputBaseProps } from '../InputBase'
import { ViewStyle } from 'react-native'
import { SelectableField } from '@codeleap/form'
import { Options } from '@codeleap/types'

type RadioOption<T extends string | number> = {
  value: T
  label: string
  disabled?: boolean
}

export type RadioGroupProps<T extends string | number> =
  Omit<InputBaseProps, 'style'> &
  {
    radioOnRight?: boolean
    style?: StyledProp<RadioInputComposition>
    field?: SelectableField<T, any>
    options: Options<T>
  }

export type RadioOptionProps<T extends string | number> = {
  item: RadioOption<T>
  selected: boolean
  onSelect(): void
  debugName?: string
  disabled?: boolean
  separator?: boolean
  reverseOrder?: boolean
  styles?: Record<RadioInputComposition, ViewStyle>
}
