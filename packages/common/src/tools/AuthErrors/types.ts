import { DEFAULT_AUTH_ERRORS } from './data'

export type TAuthError = {
  code: string
  msg: () => string | null
}

export type Err = TAuthError | null | string

export type DefaultAuthError = keyof typeof DEFAULT_AUTH_ERRORS
