import { FormTypes, StylesOf } from '@codeleap/common'
import { StyledProp } from '@codeleap/styles'
import { ReactNode } from 'react'
import { RadioInputComposition } from './styles'
import { InputBaseProps } from '../InputBase'

type RadioOption<T> = FormTypes.Options<T>[number] & {
  disabled?: boolean
}

export type RadioGroupProps<T extends string | number> =
  Omit<InputBaseProps, 'style'> &
  {
    options: RadioOption<T>[]
    value: T
    onValueChange(value: T): void
    label: ReactNode
    radioOnRight?: boolean
    style?: StyledProp<RadioInputComposition>
  }

export type RadioOptionProps<T extends string | number> = {
  item: RadioOption<T>
  selected: boolean
  onSelect(): void
  debugName?: string
  disabled?: boolean
  separator?: boolean
  reverseOrder?: boolean
  styles?: StylesOf<RadioInputComposition>
}
