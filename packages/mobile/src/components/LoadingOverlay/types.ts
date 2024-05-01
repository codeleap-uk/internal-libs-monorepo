import { StyledProp } from '@codeleap/styles'
import { ReactNode } from 'react'
import { LoadingOverlayComposition } from './styles'

export type LoadingOverlayProps = {
  style?: StyledProp<LoadingOverlayComposition>
  visible?: boolean
  children?: ReactNode
}
