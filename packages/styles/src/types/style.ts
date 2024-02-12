import { DynamicPresets } from '../lib/dynamicPresets'
import { Queries } from '../lib/mediaQuery'
import { DefaultPresets } from '../lib/presets'
import { AnyRecord, IAppVariants, IBreakpoints, ICSS } from './core'
import { Spacing } from './spacing'

export type CommonVariants = 
  Spacing |
  DynamicPresets |
  keyof DefaultPresets | 
  keyof IAppVariants

type StyleAtom<Composition = AnyRecord, Variants = string, HasBreakpoints = string> = 
  ICSS | 
  Variants | 
  Composition | 
  CommonVariants | 
  boolean | 
  null | 
  '' | 
  (HasBreakpoints extends string ? `${keyof IBreakpoints}:${string & Variants | CommonVariants}` : null) | 
  (HasBreakpoints extends string ? {
    'breakpoints': Partial<Record<`${keyof IBreakpoints}:${keyof Queries}` | keyof IBreakpoints, StyleAtom<Composition, Variants, boolean> | StyleAtom<Composition, Variants, boolean>[]>>
  } : null)

export type StyleProp<
  Composition = AnyRecord,
  Variants = string
> = StyleAtom<Composition, Variants> | StyleAtom<Composition, Variants>[]

export type VariantStyleSheet = Record<string, any>
