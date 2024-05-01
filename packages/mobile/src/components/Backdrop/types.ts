import { StyledProp } from '@codeleap/styles'
import { ReactNode } from 'react'
import { TouchableProps } from '../Touchable'
import { ViewProps } from '../View/types'
import { BackdropComposition } from './styles'

export type BackdropProps =
  Omit<TouchableProps, 'style'> &
  {
    children?: ReactNode
    visible: boolean
    wrapperProps?: ViewProps
    style?: StyledProp<BackdropComposition>
  }
