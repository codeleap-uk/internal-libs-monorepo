import { InputBaseProps } from "./types";

type OmitDiff<T1, T2> =  {
  [K in Exclude<keyof T1, keyof T2>]: T1[K]
} & {
  [K in keyof T2]: T2[K]
}
 

export function selectInputBaseProps<T extends InputBaseProps>(props: T ): {
  inputBaseProps: InputBaseProps
  others: OmitDiff<T, T>
} {
  const varList:(keyof InputBaseProps)[] = [
    'label', 
    'debugName', 
    'error', 
    'innerWrapper', 
    'leftIcon', 
    'rightIcon', 
    // 'styles', 
    'description', 
    'wrapper', 
    'children',
    'innerWrapperProps',
    'wrapperProps',
    'disabled',
  ]

  const copy = { ...props }

  const result = varList.reduce((acc, key) => {
    acc[key] = copy[key]
    delete copy[key]
    return acc
  }, {} as InputBaseProps)


  

  return { inputBaseProps: result, others: copy as OmitDiff<T, T> }
}