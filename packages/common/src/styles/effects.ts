import { AnyFunction, FunctionType } from '../types'

export const defaultEffects = {
  light: {
    shadowColor: '#999',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.23,
    shadowRadius: 24,
    elevation: 16,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 20,
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
