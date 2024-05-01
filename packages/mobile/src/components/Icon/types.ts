import { AppIcon, StyledProp } from '@codeleap/styles'
import { BadgeComponentProps } from '../Badge'
import { ViewProps } from '../View'
import { IconComposition } from './styles'

export type IconProps =
  BadgeComponentProps & 
  {
    name: AppIcon
    style?: StyledProp<IconComposition>
    color?: string
    wrapperProps?: ViewProps
    size?: number
    source?: string
  }
