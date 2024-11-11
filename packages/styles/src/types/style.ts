import { DynamicVariants } from '../lib/dynamicVariants'
import { Queries } from '../lib/mediaQuery'
import { DefaultVariants } from '../lib/defaultVariants'
import { AnyRecord, IAppVariants, IBreakpoints, ICSS, IEffects, ITheme } from './core'
import { Multiplier, Spacing } from './spacing'

type Inset =
  | `top:${Multiplier}`
  | `bottom:${Multiplier}`
  | `left:${Multiplier}`
  | `right:${Multiplier}`

export type CommonVariants =
  Spacing |
  Inset |
  DynamicVariants |
  keyof DefaultVariants |
  keyof IAppVariants |
  `effect:${keyof IEffects}`

type StyleAtom<Composition = AnyRecord, Variants = string, HasBreakpoints = string, HasComposition = string> =
  ICSS |
  Variants |
  CommonVariants |
  boolean |
  null |
  '' |

  (HasBreakpoints extends string ? {
    'breakpoints': Partial<
      Record<keyof IBreakpoints,
        StyleAtom<Composition, Variants, boolean, string> |
        StyleAtom<Composition, Variants, boolean, string>[]>
      >
  } : null) |
  (HasComposition extends string ?
      Partial<Record<
        keyof Composition,
        StyleAtom<AnyRecord, Variants, boolean, boolean> |
        StyleAtom<AnyRecord, Variants, boolean, boolean>[]
      >>
      : null
  )
  | Array<Variants | ICSS | Partial<
    Record<
      keyof Composition,
      StyleAtom<AnyRecord, Variants, boolean, boolean> |
      StyleAtom<AnyRecord, Variants, boolean, boolean>[]
    >
  >>

export type StyleProp<
  Composition = AnyRecord,
  Variants = string
> = StyleAtom<Composition, Variants> | StyleAtom<Composition, Variants>[]

export type VariantStyleSheet = Record<string, any>

export type StyledProp<T extends string> = StyleProp<Record<T, ICSS>>

export type StyleAggregator<T extends string = any> = (theme: ITheme, style: Record< T, ICSS>) => Record< T, ICSS>
