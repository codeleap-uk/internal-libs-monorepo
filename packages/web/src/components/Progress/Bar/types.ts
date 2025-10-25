import { ProgressBarComposition } from './styles'
import { ProgressProps, ProgressIndicatorProps } from '@radix-ui/react-progress'
import { ProgressPropsRoot } from '..'
import { AppIcon, StyledProp } from '@codeleap/styles'
import { TextProps } from '../../Text/types'
import { IconProps } from '../../Icon/types'
import { ViewProps } from '../../View'

export type ProgressBarProps =
  Omit<ViewProps, 'style'> &
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
    leftText?: TextProps['text'] | React.ReactElement
    leftTextProps?: Partial<TextProps>
    rightText?: TextProps['text'] | React.ReactElement
    rightTextProps?: Partial<TextProps>
  }
