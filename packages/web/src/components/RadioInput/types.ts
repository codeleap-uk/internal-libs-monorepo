import { Option } from '@codeleap/types'
import { InputBaseProps } from '../InputBase'
import { ReactNode } from 'react'
import { ICSS, StyledProp } from '@codeleap/styles'
import { RadioInputComposition } from './styles'
import { SelectableField } from '@codeleap/form'

type RadioOption<T extends string | number> = Option<T> & {
  disabled?: boolean
}

export type RadioInputProps<T extends string | number> =
  Omit<InputBaseProps, 'style'> &
  {
    options: RadioOption<T>[]
    label: ReactNode
    style?: StyledProp<RadioInputComposition>
    field?: SelectableField<T, any>
    value?: T
    onValueChange?: (value: T) => void
  }

export type RadioOptionProps<T extends string | number> = {
  item: RadioOption<T>
  selected: boolean
  onSelect(): void
  styles?: Record<RadioInputComposition, ICSS>
  debugName?: string
  disabled?: boolean
  separator?: boolean
}
