export * from './utility'


export type ComponentWithDefaultProps<P> = React.FC<P> & {
  defaultProps: Partial<P>
}