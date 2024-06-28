import { FormTypes, StylesOf } from '@codeleap/common'
import { InputBaseProps } from '../InputBase'
import { ReactNode } from 'react'
import { StyledProp } from '@codeleap/styles'
import { RadioInputComposition } from './styles'

type WrapperProps = InputBaseProps

type RadioOption<T> = FormTypes.Options<T>[number] & {
  disabled?: boolean
}

export type RadioInputProps<T extends string|number> = Omit<WrapperProps, 'style'> & {
  options: RadioOption<T>[]
  value: T
  onValueChange(value: T): void
  label: ReactNode
  style?: StyledProp<RadioInputComposition>
}

export type RadioOptionProps<T extends string|number> = {
  item: RadioOption<T>
  selected: boolean
  onSelect(): void
  styles?: StylesOf<RadioInputComposition>
  debugName?: string
  disabled?: boolean
  separator?: boolean
}
