export * from './Bar'
export * from './Circle'

export type ProgressPropsRoot = {
  progress: number
  style?: React.CSSProperties
  showProgress?: boolean
  debugName?: string
  formatProgress?: (progress: number) => string
}
