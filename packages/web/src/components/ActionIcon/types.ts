import { ComponentCommonProps } from '../../types'
import { TouchableProps } from '../Touchable'
import { ActionIconComposition } from './styles'
import { IconProps } from '../Icon'
import { StyledProp } from '@codeleap/styles'

export type ActionIconProps = TouchableProps & ComponentCommonProps & {
    iconProps?: Partial<IconProps>
    icon?: IconProps['name']
    name?: IconProps['name']
    style?: StyledProp<ActionIconComposition>
  }
