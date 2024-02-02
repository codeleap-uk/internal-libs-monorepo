import { AnyFunction } from '../../types'
import { DEFAULT_AUTH_ERRORS } from './data'
import { DefaultAuthError, Err, TAuthError } from './types'

export * from './types'

class AuthError extends Error {
  code: TAuthError['code']
  msg: TAuthError['msg']

  constructor(message: TAuthError['msg'], code: TAuthError['code']) {
    const _error = 'AuthError:' + code?.toLocaleUpperCase()
    super(_error)
    this.name = _error
    this.code = code
    this.msg = message
  }
}

type ErrorHandler<E> = (err: E | null, module: string, args: any) => void

export class AppAuthErrors<T extends Record<string, string | object | AnyFunction>, F extends ErrorHandler<AuthError>> {
  public errors: Omit<Record<keyof T | keyof typeof DEFAULT_AUTH_ERRORS, AuthError>, 'social'>

  public social: Omit<Record<keyof T['social'] | keyof typeof DEFAULT_AUTH_ERRORS['social'], AuthError>, 'social'>

  public onError: ErrorHandler<Err>

  public defaultErrors = DEFAULT_AUTH_ERRORS

  private socialKey: string = 'social'
  
  constructor(newErrors: T, errorFunction: F) {
    const defaultErrors = DEFAULT_AUTH_ERRORS
    
    const socialAuthErrors = {
      ...defaultErrors[this.socialKey],
      ...(newErrors?.[this.socialKey] as object ?? {}),
    } as any

    const socialErrors = this.registryErrors(socialAuthErrors)
    this.social = socialErrors

    if (!!newErrors['social']) {
      delete newErrors['social']
    }

    if (!!defaultErrors['social']) {
      delete defaultErrors['social']
    }

    const baseAuthErrors = {
      ...defaultErrors,
      ...(newErrors as object ?? {}),
    } as any

    const authErrors = this.registryErrors(baseAuthErrors)
    this.errors = authErrors

    this.registryErrorFunction(errorFunction)
  }

  public getError(err: Err): AuthError | null {
    if (!err) return null

    if (typeof err == 'string') {
      return this.errors?.[err] ?? this.social?.[err]
    }

    const authError = err as TAuthError

    if (!!authError?.code) {
      return this.errors?.[authError?.code] ?? this.social?.[authError?.code]
    }

    return null
  }

  public isError(err: Err, key: Exclude<keyof T | DefaultAuthError, 'social'>) {
    const _error = this.errors?.[key]

    return err == _error.code || (err as TAuthError)?.code == _error.code
  }

  public verifyError(err: Err): boolean {
    return !!(this.getError(err))
  }

  public exception(err: Err): void | AuthError {
    const _error = this.getError(err)

    if (_error != null) {
      throw new AuthError(_error?.msg, _error?.code)
    }
  }

  public createAuthError(message: TAuthError['msg'], code: TAuthError['code']) {
    return new AuthError(message, code)
  }

  private registryErrors(unregisteredErrors: T): any {
    const state = {}

    for (const errorKey in (unregisteredErrors as object)) {
      const errorMsg = unregisteredErrors[errorKey] as string

      if (typeof errorMsg === 'string' || errorMsg == null) {
        state[errorKey] = new AuthError(() => errorMsg, errorKey)
      } else if (typeof errorMsg === 'function') {
        state[errorKey] = new AuthError(errorMsg, errorKey)
      }
    }

    return state
  }

  private registryErrorFunction(pureErrorFunction: Function) {
    this.onError = (err, module = null, args = {}) => {
      const authError = this.getError(err)
      pureErrorFunction?.(authError, module, args)
    }
  }
}
