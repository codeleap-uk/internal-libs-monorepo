import { ComponentVariants, PropsOf, StylesOf } from '@codeleap/common'
import {
  Icon,
  ProgressCircleComposition,
  ProgressCirclePresets,
  Text,
  View,
} from '../../components'
import { buildStyles } from 'react-circular-progressbar'

type TextProps = PropsOf<typeof Text>
type IconProps = PropsOf<typeof Icon>
type ChildrenProps = { progress?: number }

export type ProgressCircleProps = Omit<
  PropsOf<typeof View>,
  'styles' | 'variants' | 'children'
> &
  ComponentVariants<typeof ProgressCirclePresets> & {
    progress?: number
    text?: TextProps['text']
    textProps?: Partial<TextProps>
    icon?: IconProps['name']
    iconProps?: Partial<IconProps>
    styles?: StylesOf<ProgressCircleComposition>
    children?: ((props: ChildrenProps) => JSX.Element) | JSX.Element
    circleProps?: ReturnType<typeof buildStyles>
    debugName?: string
    showProgress?: boolean
  }
