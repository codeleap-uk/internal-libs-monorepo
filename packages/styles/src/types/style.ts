import { DynamicPresets } from '../lib/dynamicPresets'
import { DefaultPresets } from '../lib/presets'
import { AnyRecord, AppVariants, IBreakpoints, ICSS } from './core'
import { Spacing } from './spacing'

type StyleAtom<Composition = AnyRecord, Variants = string> = 
  ICSS | 
  Variants | 
  Composition | 
  Spacing |
  DynamicPresets |
  keyof DefaultPresets | 
  keyof AppVariants | 
  `${keyof IBreakpoints}:${string & Variants}`
  | boolean 
  | null 
  | ''

export type StyleProp<
  Composition = AnyRecord,
  Variants = string
> = StyleAtom<Composition, Variants> | StyleAtom<Composition, Variants>[]

export type VariantStyleSheet = Record<string, any>
