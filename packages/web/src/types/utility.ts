import { CSSInterpolation, CSSObject } from '@emotion/css'

export type StylesOf<C extends string> = Partial<Record<C, CSSInterpolation | CSSInterpolation[]>>
