import { InputBaseProps } from './types'

type OmitDiff<T1, T2> = {
  [K in Exclude<keyof T1, keyof T2>]: T1[K]
} & {
  [K in keyof T2]: T2[K]
}

type InputBaseKey = keyof InputBaseProps

export function selectInputBaseProps<T extends InputBaseProps>(props: T): {
  inputBaseProps: InputBaseProps
  others: OmitDiff<T, T>
} {
  const varList:InputBaseKey[] = [
    'label',
    'style',
    'error',
    'innerWrapper',
    'leftIcon',
    'rightIcon',
    'description',
    'wrapper',
    'children',
    'innerWrapperProps',
    'wrapperProps',
    'disabled',
    'hideErrorMessage',
  ]

  const copy = { ...props }

  const result = varList.reduce((acc, key) => {
    // @ts-ignore
    acc[key] = copy[key]

    return acc
  }, {} as InputBaseProps)

  return { inputBaseProps: result, others: copy as OmitDiff<T, T> }
}
