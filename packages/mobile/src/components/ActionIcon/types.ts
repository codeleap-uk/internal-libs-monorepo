import { AppIcon, StyledProp } from '@codeleap/styles'
import { BadgeComponentProps } from '../Badge'
import { IconProps } from '../Icon'
import { TouchableProps } from '../Touchable'
import { ActionIconComposition } from './styles'

export type ActionIconProps =
  Omit<TouchableProps, 'style'> &
  BadgeComponentProps & 
  {
    iconProps?: Partial<IconProps>
    icon?: AppIcon
    name?: AppIcon
    style?: StyledProp<ActionIconComposition>
  }
