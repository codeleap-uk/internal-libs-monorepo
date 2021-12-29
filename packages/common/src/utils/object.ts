import { FunctionType } from '..'

export function deepMerge<T extends object, S extends object>(base: T, changes: S): T & S {
  const obj = {
    ...base,
  } as T & S

  for (const [key, value] of Object.entries(changes)) {
    obj[key] = typeof value === 'object' ? deepMerge(obj[key], changes[key]) : value
  }

  return obj
}

export function mapObject<T>(obj:T, callback: FunctionType<[[keyof T, T[keyof T]]], any>) {
  return Object.entries(obj).map((args) => callback(args as [keyof T, T[keyof T] ]))
}
