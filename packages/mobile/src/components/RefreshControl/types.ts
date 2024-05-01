import { StyledProp } from '@codeleap/styles'
import { RefreshControlProps as RNRefreshControlProps } from 'react-native'
import { RefreshControlComposition } from './styles'

export type RefreshControlProps =
  Omit<RNRefreshControlProps, 'style'> &
  {
    style?: StyledProp<RefreshControlComposition>
  }
