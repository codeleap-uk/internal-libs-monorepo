import { CSSObject } from '@emotion/css';
import { CSSProperties } from 'react';

export type StylesOf<C extends string> = Record<C, CSSProperties|CSSObject> 
