import { ProgressBarComposition } from './styles'
import { ProgressProps, ProgressIndicatorProps } from '@radix-ui/react-progress'
import { ProgressPropsRoot } from '..'
import { ElementType } from 'react'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { TextProps as _TextProps } from '../../Text/types'
import { IconProps } from '../../Icon/types'
import { ViewProps } from '../../View'

type TextProps = _TextProps<ElementType>

export type ProgressBarProps =
  Omit<ViewProps<'div'>, 'style'> &
  Omit<ProgressPropsRoot, 'style'> & 
  {
    style?: StyledProp<ProgressBarComposition>
    progressIndicatorProps?: ProgressIndicatorProps
    progressRootProps?: ProgressProps
    leftIcon?: AppIcon
    leftIconProps?: Partial<IconProps>
    rightIcon?: AppIcon
    rightIconProps?: Partial<IconProps>
    text?: string
    textProps?: Partial<TextProps>
    leftText?: TextProps['text'] | JSX.Element
    leftTextProps?: Partial<TextProps>
    rightText?: TextProps['text'] | JSX.Element
    rightTextProps?: Partial<TextProps>
  }
