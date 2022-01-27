import { FunctionType } from '..'
import { Logger } from '../tools/Logger'

export function deepMerge(base ={}, changes={}): any {
  const obj = {
    ...base,
  }
  let changeEntries = []
  try {
    changeEntries = Object.entries(changes)
  } catch (e){
    return changes
  }
  for (const [key, value] of changeEntries) {
    obj[key] = typeof value === 'object' && !Array.isArray(value) ? deepMerge(obj[key], changes[key] ) : value
  }

  return obj
}

export function mapObject<T>(obj:T, callback: FunctionType<[[keyof T, T[keyof T]]], any>) {
  return Object.entries(obj).map((args) => callback(args as [keyof T, T[keyof T] ]))
}

export const deepSet = ([path, value]) => {
  const parts = path.split('.')
  const newObj = {}
 
  if (parts.length === 1){
    newObj[parts[0]] = value
  } else {
    newObj[parts[0]] = deepSet([parts.slice(1).join('.'), value])
  }

  return newObj
}

export const deepGet = (path, obj) => {
  const parts = path.split('.')
  let newObj = {...obj}
 
  for (const prop of parts){
    newObj = newObj[prop]
  }

  return newObj
}
