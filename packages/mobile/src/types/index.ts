export * from './utility'


export type ComponentWithDefaultProps<P = any> = ((props: P) => React.ReactElement) & {
  defaultProps: Partial<P>
}

export type ForwardRefComponentWithDefaultProps<P = any, R = any> = ((props: P, ref: R) => React.ReactElement) & {
  defaultProps?: Partial<P>
}
