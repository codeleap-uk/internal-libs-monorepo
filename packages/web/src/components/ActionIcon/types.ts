import { ComponentCommonProps } from '../../types'
import { TouchableProps } from '../Touchable'
import { ActionIconComposition } from './styles'
import { IconProps } from '../Icon'
import { AppIcon, StyledProp } from '@codeleap/styles'

export type ActionIconProps =
  Omit<TouchableProps, 'style' | 'debugName'> &
  ComponentCommonProps &
  {
    iconProps?: Partial<IconProps>
    icon?: AppIcon
    name?: AppIcon
    style?: StyledProp<ActionIconComposition>
  }
