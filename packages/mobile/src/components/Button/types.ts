import { AppIcon, StyledProp } from '@codeleap/styles'
import { ReactNode } from 'react'
import { BadgeComponentProps } from '../Badge'
import { TouchableProps } from '../Touchable'
import { ButtonComposition } from './styles'

export type ButtonProps =
  Omit<TouchableProps, 'style'> &
  BadgeComponentProps &
  {
    text?: string
    rightIcon?: AppIcon
    icon?: AppIcon
    loading?: boolean
    debounce?: number
    debugName: string
    selected?: boolean
    children?: ReactNode
    style?: StyledProp<ButtonComposition>
  }
