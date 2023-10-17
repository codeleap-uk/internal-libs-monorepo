import { ElementType } from 'react'
import { TextProps } from '../components'

export * from './Bar'
export * from './Circle'

export type ProgressPropsRoot = {
  progress: number
  style?: React.CSSProperties
  textProps?: Partial<TextProps<ElementType>>
  showProgress?: boolean
  debugName?: string
  formatProgress?: (progress: number) => string
}
