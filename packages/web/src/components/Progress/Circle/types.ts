import { ComponentVariants, IconPlaceholder, PropsOf, StylesOf } from '@codeleap/common'
import {
  IconProps,
  ProgressCircleComposition,
  ProgressCirclePresets,
  View,
} from '../../components'
import { ProgressPropsRoot, TextProps } from '..'
import { buildStyles } from 'react-circular-progressbar'

type ChildrenProps = { progress?: number }

export type ProgressCircleProps = Omit<
  PropsOf<typeof View>,
  'styles' | 'variants' | 'children'
> &
  ComponentVariants<typeof ProgressCirclePresets> &
  ProgressPropsRoot & {
    text?: TextProps['text'] | JSX.Element
    icon?: IconPlaceholder
    iconProps?: Partial<IconProps>
    styles?: StylesOf<ProgressCircleComposition>
    children?: ((props: ChildrenProps) => JSX.Element) | JSX.Element
    circleProps?: ReturnType<typeof buildStyles>
  }
