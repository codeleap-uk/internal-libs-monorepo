import { PropsOf, StylesOf } from '@codeleap/common'
import { InputBaseComposition } from './styles'
import { ActionIcon, ActionIconComposition } from '../ActionIcon'

type ActionIconProps = PropsOf<typeof ActionIcon>

type OrderedParts = 'label' | 'description' | 'innerWrapper' | 'error'

export type InputBaseProps = React.PropsWithChildren<{
  label?: React.ReactNode
  error?: React.ReactNode
  leftIcon?: ActionIconProps
  rightIcon?: ActionIconProps
  wrapper?: React.FC<any>
  wrapperProps?: any
  innerWrapper?: React.FC<any>
  innerWrapperProps?: any
  style?: StylesOf<InputBaseComposition>
  description?: React.ReactNode
  debugName: string
  focused?: boolean
  disabled?: boolean
  order?: OrderedParts[]
  labelAsRow?: boolean
  noError?: boolean
  innerWrapperRef?: React.MutableRefObject<HTMLDivElement | null>
}>

export type OmitDiff<T1, T2> = {
  [K in Exclude<keyof T1, keyof T2>]: T1[K]
} & {
  [K in keyof T2]: T2[K]
}

export type InputBaseKey = keyof InputBaseProps

export type IconStyles = StylesOf<ActionIconComposition>

export type IconState = {
  focused: boolean
  hasError: boolean
  disabled: boolean
}
