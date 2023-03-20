import { AnyFunction, FunctionType } from '../types'

export const defaultEffects = {
  light: {
    boxShadow: '0px 8px 24px #99999933',
  },
  heavy: {
    boxShadow: '0px 5px 15px #00000059',
  },
} as const

export type IncludeEffectsReturn<T extends AnyFunction> = Record<
  keyof typeof defaultEffects,
  ReturnType<T>
>

export function includeEffects<T extends FunctionType<[any], any>>(
  fn: T,
): IncludeEffectsReturn<T> {
  const EffectsFromTheme = {}

  for (const [key, value] of Object.entries(defaultEffects)) {
    EffectsFromTheme[key] = fn(value)
  }

  return EffectsFromTheme as IncludeEffectsReturn<T>
}
