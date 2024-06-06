import { PropsOf } from '@codeleap/common'
import { InputBaseComposition } from './styles'
import { ActionIcon } from '../ActionIcon'
import { StyledProp } from '@codeleap/styles'

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
  style?: StyledProp<InputBaseComposition>
  styleRegistryName?: string
  description?: React.ReactNode
  debugName: string
  focused?: boolean
  disabled?: boolean
  order?: OrderedParts[]
  labelAsRow?: boolean
  noError?: boolean
  innerWrapperRef?: React.MutableRefObject<HTMLDivElement | null>
}>
