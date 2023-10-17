import { ComponentVariants, IconPlaceholder, PropsOf, StylesOf } from '@codeleap/common'
import {
  IconProps,
  ProgressCircleComposition,
  ProgressCirclePresets,
  View,
  TextProps,
} from '../../components'
import { ProgressPropsRoot } from '..'
import { buildStyles } from 'react-circular-progressbar'
import { ElementType } from 'react'

type ChildrenProps = { progress?: number }

export type ProgressCircleProps = Omit<
  PropsOf<typeof View>,
  'styles' | 'variants' | 'children'
> &
  ComponentVariants<typeof ProgressCirclePresets> &
  ProgressPropsRoot & {
    text?: TextProps<ElementType>['text'] | JSX.Element
    icon?: IconPlaceholder
    iconProps?: Partial<IconProps>
    styles?: StylesOf<ProgressCircleComposition>
    children?: ((props: ChildrenProps) => JSX.Element) | JSX.Element
    circleProps?: ReturnType<typeof buildStyles>
  }
