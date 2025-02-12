export * from './utility'


export type ComponentWithDefaultProps<P = any> = ((props: P) => JSX.Element) & {
  defaultProps: Partial<P>
}

export type ForwardRefComponentWithDefaultProps<P = any, R = any> = ((props: P, ref: R) => JSX.Element) & {
  defaultProps?: Partial<P>
}
