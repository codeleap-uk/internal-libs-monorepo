import { DynamicPresets } from '../lib/dynamicPresets'
import { DefaultPresets } from '../lib/presets'
import { AnyRecord, IAppVariants, IBreakpoints, ICSS } from './core'
import { Spacing } from './spacing'

export type CommonVariants = 
  Spacing |
  DynamicPresets |
  keyof DefaultPresets | 
  keyof IAppVariants

type StyleAtom<Composition = AnyRecord, Variants = string> = 
  ICSS | 
  Variants | 
  Composition | 
  CommonVariants |
  `${keyof IBreakpoints}:${string & Variants}`
  | boolean 
  | null 
  | ''

export type StyleProp<
  Composition = AnyRecord,
  Variants = string
> = StyleAtom<Composition, Variants> | StyleAtom<Composition, Variants>[]

export type VariantStyleSheet = Record<string, any>
