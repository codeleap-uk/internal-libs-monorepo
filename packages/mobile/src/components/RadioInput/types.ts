import { StyledProp } from '@codeleap/styles'
import { ReactNode } from 'react'
import { RadioInputComposition } from './styles'
import { InputBaseProps } from '../InputBase'
import { ViewStyle } from 'react-native'
import { Field, SelectableField } from '@codeleap/form'

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
