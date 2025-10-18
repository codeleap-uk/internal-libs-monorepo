import { DEFAULT_AUTH_ERRORS } from './data'

export type TAuthError = {
  code: string
  msg: (args?: any) => string | null
}

export type Err = TAuthError | null | string | unknown

export type DefaultAuthError = keyof typeof DEFAULT_AUTH_ERRORS
