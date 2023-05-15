import { PropsOf } from "@codeleap/common"
import { StylesOf } from "../../types"

import { View } from "../View"
import { InputBaseComposition } from "./styles"
import { ActionIcon } from "../ActionIcon"

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
  styles?: StylesOf<InputBaseComposition>
  description?: React.ReactNode
  debugName: string
  focused?: boolean
  disabled?: boolean
  order?: OrderedParts[]
  style?: any
  labelAsRow?: boolean
  wrapperRef?: any
}>
