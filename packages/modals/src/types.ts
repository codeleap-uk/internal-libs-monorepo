import { AnyFunction } from '@codeleap/common'

type AllButFirst<T extends any[]> = T extends [infer _, ...infer Rest] ? Rest : []

export type ExcludeFromParam<
  T extends AnyFunction,
  E = any
> = (p?: Exclude<Parameters<T>[0], E>, ...args: AllButFirst<Parameters<T>>) => ReturnType<T>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModalOverrides {
  WrapperComponent: (props: any) => any
}
