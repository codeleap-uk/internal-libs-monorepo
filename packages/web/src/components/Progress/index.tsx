import { ElementType } from 'react'
import { TextProps as _TextProps } from '../components'

export * from './Bar'
export * from './Circle'

export type TextProps = _TextProps<ElementType>

export type ProgressPropsRoot = {
  progress: number
  style?: React.CSSProperties
  textProps?: Partial<TextProps>
  showProgress?: boolean
  debugName?: string
  formatProgress?: (progress: number) => string
}
