import { AnyFunction } from '..'

export function isNumber(x): x is number{
  return typeof x === 'number'
}

export function isString(x): x is string{
  return typeof x === 'string'
}
export function isObject(x): x is object{
  return typeof x === 'object'
}
export function isBoolean(x): x is boolean{
  return typeof x === 'boolean'
}
export function isFunction(x): x is (AnyFunction|(new (...args) => any)){
  return typeof x === 'function'
}
export function isArray(x): x is any[]{
  return Array.isArray(x)
}

export function is<T extends unknown>(x, Enum: T[]): x is T {
  return Enum.includes(x)
}
