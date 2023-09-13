import { ICSS } from './core'

type StyleAtom<Composition = any, Variants = string> = ICSS | Variants | Composition

export type StyleProp<
  Composition = any,
  Variants = string
> = StyleAtom<Composition, Variants> | StyleAtom<Composition, Variants>[]

export type VariantStyleSheet = Record<string, any>
