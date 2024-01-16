export const getTestId = (props: Record<string, any>) => {
  return props.testId || props['data-testid'] || props.id || props.debugName
}
