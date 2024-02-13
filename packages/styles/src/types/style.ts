import { DynamicPresets } from '../lib/dynamicPresets'
import { Queries } from '../lib/mediaQuery'
import { DefaultPresets } from '../lib/presets'
import { AnyRecord, IAppVariants, IBreakpoints, ICSS, IEffects } from './core'
import { Multiplier, Spacing } from './spacing'

type Inset = 
  | `top:${Multiplier}`
  | `bottom:${Multiplier}`
  | `left:${Multiplier}`
  | `right:${Multiplier}`

export type CommonVariants = 
  Spacing |
  Inset |
  DynamicPresets |
  keyof DefaultPresets | 
  keyof IAppVariants |
  `effect:${keyof IEffects}`

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
