import { deepMerge, deepSet, traverse } from './object'
import { FunctionType } from '../types/utility'

export type Matcher<T> = string|Partial<RegExp>|FunctionType<[valueOrKey:any, type: T], boolean>

type ObfuscateArgs = {
    object: any
    keys:(Matcher<'key'>)[]
    values:(Matcher<'value'>)[]
}

function match(m:Matcher<any>, ...args:[any, any]):boolean {
  if (typeof m === 'function') {
    return m(...args)
  }

  if (m instanceof RegExp) {
    return m.test(String(args[0]))
  }

  if (typeof args[0] === 'string') {
    return (m as string).includes(args[0])
  }

  return false
}

export function obfuscate(args:ObfuscateArgs) {
  let newObj = { ...args.object }
  const isKeySensitive = (data) => args.keys.some(k => match(k, data.key, 'key'))
  const isValueSensitive = (data) => args.values.some(k => match(k, data.value, 'value'))

  traverse(args.object, (data) => {

    if (isKeySensitive(data) || isValueSensitive(data)) {
      newObj = deepMerge(newObj, deepSet([data.path.join('.'), '[Obfuscated]']))
    }
  })

  return newObj
}
