import { PropsOf } from "@codeleap/common"
import { StylesOf } from "../../types"

import { View } from "../View"
import { InputBaseComposition } from "./styles"
import { ActionIcon } from "../ActionIcon"

type ActionIconProps = PropsOf<typeof ActionIcon>


export type InputBaseProps = React.PropsWithChildren<{
  label?: React.ReactNode 
  error?: React.ReactNode
  leftIcon?: Partial<ActionIconProps> | JSX.Element
  rightIcon?: Partial<ActionIconProps> | JSX.Element
  wrapper?: React.FC<any>
  wrapperProps?: any
  innerWrapper?: React.FC<any>
  innerWrapperProps?: any
  styles?: StylesOf<InputBaseComposition>
  description?: React.ReactNode
  debugName: string
  focused?: boolean
  disabled?: boolean
}>
