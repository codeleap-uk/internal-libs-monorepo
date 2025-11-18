import { TouchableProps } from '../Touchable'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { InputBaseProps } from '../InputBase'
import { HTMLProps } from '../../types'
import { TextInputComposition } from './styles'
import { Field } from '@codeleap/form'
import { RefObject } from 'react'

type NativeTextInputProps = HTMLProps<'input'>

export type InputRef = HTMLInputElement

export type TextInputProps =
  Omit<InputBaseProps, 'style' | 'ref'> &
  Omit<NativeTextInputProps, 'value' | 'crossOrigin' | 'ref' | 'style'> &
  {
    style?: StyledProp<TextInputComposition>
    password?: boolean
    debugName?: string
    visibilityToggle?: boolean
    multiline?: boolean
    onPress?: TouchableProps['onPress']
    caretColor?: string
    focused?: boolean
    forceError?: string
    rows?: number
    visibleIcon?: AppIcon
    hiddenIcon?: AppIcon
    field?: Field<string, any, any>
    value?: string
    onValueChange?: (value: string) => void
    onChangeText?: NativeTextInputProps['onChange']
    ref?: RefObject<InputRef | null>
  }
