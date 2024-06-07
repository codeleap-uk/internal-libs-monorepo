import { IconPlaceholder, PropsOf } from '@codeleap/common'
import { ProgressBarComposition } from './styles'
import { ProgressProps, ProgressIndicatorProps } from '@radix-ui/react-progress'
import { IconProps, View, TextProps as _TextProps } from '../../components'
import { ProgressPropsRoot } from '..'
import { ElementType } from 'react'
import { StyledProp } from '@codeleap/styles'

type TextProps = _TextProps<ElementType>

export type ProgressBarProps =PropsOf<typeof View> & ProgressPropsRoot & {
    style?: StyledProp<ProgressBarComposition>
    progressIndicatorProps?: ProgressIndicatorProps
    progressRootProps?: ProgressProps
    leftIcon?: IconPlaceholder
    leftIconProps?: Partial<IconProps>
    rightIcon?: IconPlaceholder
    rightIconProps?: Partial<IconProps>
    text?: string
    textProps?: Partial<TextProps>
    leftText?: TextProps['text'] | JSX.Element
    leftTextProps?: Partial<TextProps>
    rightText?: TextProps['text'] | JSX.Element
    rightTextProps?: Partial<TextProps>
  }
