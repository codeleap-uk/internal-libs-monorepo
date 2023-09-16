import { AnyRecord, IBreakpoints, ICSS } from './core'

type StyleAtom<Composition = AnyRecord, Variants = string> = ICSS | Variants | Composition | `${keyof IBreakpoints}:${string & Variants}` | boolean | null | ''

export type StyleProp<
  Composition = AnyRecord,
  Variants = string
> = StyleAtom<Composition, Variants> | StyleAtom<Composition, Variants>[]

export type VariantStyleSheet = Record<string, any>
