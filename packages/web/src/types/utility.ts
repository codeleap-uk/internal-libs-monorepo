import { CSSObject } from '@emotion/css';

export type StylesOf<C extends string> = Partial<Record<C, CSSObject>>;
