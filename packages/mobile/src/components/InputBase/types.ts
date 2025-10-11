import { PropsOf, StylesOf } from '@codeleap/types'
import { InputBaseComposition } from './styles'
import { ActionIcon } from '../ActionIcon'
import { View, ViewProps } from 'react-native'

type ActionIconProps = PropsOf<typeof ActionIcon>

type OrderedParts = 'label' | 'description' | 'innerWrapper' | 'error'
type IconProp = Partial<ActionIconProps> | React.ReactElement

export type InputBaseProps = React.PropsWithChildren<{
  label?: React.ReactNode
  error?: React.ReactNode
  leftIcon?: IconProp
  rightIcon?: IconProp
  wrapper?: (props: any) => React.ReactElement
  wrapperProps?: any
  innerWrapper?: (props: any) => React.ReactElement
  innerWrapperProps?: any
  description?: React.ReactNode
  debugName?: string
  focused?: boolean
  disabled?: boolean
  order?: OrderedParts[]
  style?: StylesOf<InputBaseComposition>
  labelAsRow?: boolean
  hideErrorMessage?: boolean
  hasValue?: boolean
  onLayout?: ViewProps['onLayout']
  ref?: any
}>
