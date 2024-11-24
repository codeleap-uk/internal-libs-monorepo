import { AnyFunction } from '..'
import React from 'react'

export function isNumber(x): x is number {
  return typeof x === 'number'
}

export function isString(x): x is string {
  return typeof x === 'string'
}
export function isObject(x): x is object {
  return typeof x === 'object'
}
export function isBoolean(x): x is boolean {
  return typeof x === 'boolean'
}
export function isFunction(x): x is (AnyFunction) {
  return typeof x === 'function'
}

export function isConstructor(x): x is (new (...args) => any) {
  return typeof x === 'function'
}
export function isArray(x): x is any[] {
  return Array.isArray(x)
}
export function isUndefined(x): x is undefined {
  return typeof x === 'undefined'
}

export function isNull(x): x is null {
  return x === null
}

export function isNil(x): x is null | undefined {
  return isNull(x) || isUndefined(x)
}

export function is<T >(x, Enum: T[]): x is T {
  return Enum.includes(x)
}
type Abstract<T> = Function & {prototype: T}

type Constructor<T> = new (...args: any[]) => T
type Class<T = any> = Abstract<T> | Constructor<T>

export function isInstance<T extends Class, X = T extends Class<infer X> ? X : never>(x, cls: T): x is X {
  return x instanceof cls
}

export function isElement(x): x is React.ReactElement {
  return React.isValidElement(x)
}

export function isComponentOrElement<P>(x: any): x is React.ComponentType<P> | React.ReactElement {
  return isFunction(x) || isElement(x)
}
