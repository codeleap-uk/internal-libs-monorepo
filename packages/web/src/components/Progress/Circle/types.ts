import { PropsOf } from '@codeleap/common'
import { IconProps, ProgressCircleComposition, ViewProps, TextProps as _TextProps } from '../../components'
import { ProgressPropsRoot } from '..'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'
import { ElementType } from 'react'
import { AppIcon, StyledProp } from '@codeleap/styles'

type TextProps = _TextProps<ElementType>

export type ProgressCircleProps =
  Omit<ViewProps, 'style'> &
  Omit<ProgressPropsRoot, 'style'> &
  {
    style?: StyledProp<ProgressCircleComposition>
    circleProps?: PropsOf<typeof CircularProgressbarWithChildren>
    circleStyles?: Parameters<typeof buildStyles>[0]
    children?: React.ReactNode
    size?: number
    text?: TextProps['text'] | JSX.Element
    textProps?: Partial<TextProps>
    icon?: AppIcon
    iconProps?: Partial<IconProps>
  }
