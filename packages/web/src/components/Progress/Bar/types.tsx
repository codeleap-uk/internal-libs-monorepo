import { ComponentVariants, IconPlaceholder, PropsOf, StylesOf } from '@codeleap/common'
import { ProgressBarComposition, ProgressBarPresets } from './styles'
import {
  ProgressProps,
  ProgressIndicatorProps,
} from '@radix-ui/react-progress'
import { IconProps, View } from '../../components'
import { TextProps, ProgressPropsRoot } from '..'

export type ProgressBarProps = ComponentVariants<typeof ProgressBarPresets> &
  Omit<PropsOf<typeof View>, 'variants' | 'responsiveVariants' | 'styles'> &
  ProgressPropsRoot & {
    styles?: StylesOf<ProgressBarComposition>
    progressIndicatorProps?: ProgressIndicatorProps
    progressRootProps?: ProgressProps
    leftIcon?: IconPlaceholder
    leftIconProps?: Partial<IconProps>
    rightIcon?: IconPlaceholder
    rightIconProps?: Partial<IconProps>
    leftText?: TextProps['text'] | JSX.Element
    leftTextProps?: Partial<TextProps>
    rightText?: TextProps['text'] | JSX.Element
    rightTextProps?: Partial<TextProps>
  }