import { ViewProps } from 'react-native'
import { StyledProp } from '@codeleap/styles'
import { CollapseComposition } from './styles'

export type CollapseProps = Omit<ViewProps, 'style'> & {
  open: boolean
  children: React.ReactNode
  style?: StyledProp<CollapseComposition>
}