import { PropsOf, StylesOf } from '@codeleap/types'
import { InputBaseComposition } from './styles'
import { ActionIcon } from '../ActionIcon'
import { View, ViewProps } from 'react-native'

type ActionIconProps = PropsOf<typeof ActionIcon>

type OrderedParts = 'label' | 'description' | 'innerWrapper' | 'error'
type IconProp = Partial<ActionIconProps> | JSX.Element

export type InputBaseProps = React.PropsWithChildren<{
  label?: React.ReactNode
  error?: React.ReactNode
  leftIcon?: IconProp
  rightIcon?: IconProp
  wrapper?: React.FC<any>
  wrapperProps?: any
  innerWrapper?: React.FC<any>
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
  ref?: React.Ref<View>
  onLayout?: ViewProps['onLayout']
}>
