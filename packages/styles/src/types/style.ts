import { DefaultPresets } from '../lib/presets'
import { AnyRecord, IBreakpoints, ICSS } from './core'
import { Spacing } from './spacing'

type StyleAtom<Composition = AnyRecord, Variants = string> = 
  ICSS | 
  Variants | 
  Composition | 
  Spacing | 
  keyof DefaultPresets | 
  `${keyof IBreakpoints}:${string & Variants}` 
  | boolean 
  | null 
  | ''

export type StyleProp<
  Composition = AnyRecord,
  Variants = string
> = StyleAtom<Composition, Variants> | StyleAtom<Composition, Variants>[]

export type VariantStyleSheet = Record<string, any>
