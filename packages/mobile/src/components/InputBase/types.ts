import { PropsOf } from "@codeleap/common"
import { StylesOf } from "../../types"
import { ActionIconProps } from "../ActionIcon"
import { View } from "../View"
import { InputBaseComposition } from "./styles"

export type InputBaseProps = React.PropsWithChildren<{
  label?: React.ReactNode 
  error?: React.ReactNode
  leftIcon?: Partial<ActionIconProps> | React.ReactNode | React.FC<Partial<ActionIconProps>>
  rightIcon?: Partial<ActionIconProps> | React.ReactNode | React.FC<Partial<ActionIconProps>>
  wrapper?: React.FC<PropsOf<typeof View>>
  innerWrapper?: React.FC<PropsOf<typeof View>>
  styles?: StylesOf<InputBaseComposition>
  subtitle?: React.ReactNode
  debugName: string
}>
