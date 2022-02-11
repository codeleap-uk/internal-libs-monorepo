import { deepMerge, deepSet, traverse } from './object'
import { FunctionType } from '../types/utility'
import {  } from '.'

type Matcher<T> = string|RegExp|FunctionType<[valueOrKey:any, type: T], boolean>

type ObfuscateArgs = {
    object: any
    keys:(Matcher<'key'>)[]
    values:(Matcher<'value'>)[]
}

function match(m:Matcher<any>, ...args:[any, any]):boolean{
  if (typeof m === 'function'){
    return m(...args)
  }

  if (m instanceof RegExp){
    return m.test(String(args[0]))
  }

  if (typeof args[0] === 'string'){
    return m.includes(args[0])
  }

  return false
}

export function obfuscate(args:ObfuscateArgs){    
  let newObj = {...args.object }

  traverse(args.object, (data) => {
    const isKeySensitive = () => args.keys.some(k => match(k, data.key, 'key'))
    const isValueSensitive = () => args.keys.some(k => match(k, data.value, 'value'))

    if (isKeySensitive() || isValueSensitive()){
      newObj = deepMerge(newObj, deepSet([data.path, '[Obfuscated]']))       
    }
  })

  return newObj
}
