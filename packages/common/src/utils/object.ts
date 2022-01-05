import { FunctionType } from '..'

export function deepMerge(base ={}, changes={}): any {
  const obj = {
    ...base,
  }
  for (const [key, value] of Object.entries(changes)) {
    obj[key] = typeof value === 'object' && !Array.isArray(value) ? deepMerge(obj[key], changes[key] ) : value
  }

  return obj
}

export function mapObject<T>(obj:T, callback: FunctionType<[[keyof T, T[keyof T]]], any>) {
  return Object.entries(obj).map((args) => callback(args as [keyof T, T[keyof T] ]))
}
