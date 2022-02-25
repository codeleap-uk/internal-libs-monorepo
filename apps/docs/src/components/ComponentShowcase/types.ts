type BaseControl<Value> = {
  label: string
  value: Value
  onChange(v: Value): void
  options?: string[]
}

export type PropControls<Props> = {
  [Property in keyof Props]: BaseControl<Props[Property]>;
}
