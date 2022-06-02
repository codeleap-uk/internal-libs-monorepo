import { deepMerge, deepSet, traverse } from './object'
import { FunctionType } from '../types/utility'
import { inspect } from 'util'
import parse from 'url-parse'
import { cloneDeep } from 'lodash'

export type Matcher<T> = string|Partial<RegExp>|FunctionType<[valueOrKey:any, type: T], boolean>

type ObfuscateArgs = {
    object: any
    keys:(Matcher<'key'>)[]
    values:(Matcher<'value'>)[]
}

// function match(m:Matcher<any>, ...args:[any, any]):boolean {
//   if (typeof m === 'function') {
//     return m(...args)
//   }

//   if (m instanceof RegExp) {
//     return m.test(String(args[0]))
//   }

//   if (typeof args[0] === 'string') {
//     return (m as string).includes(args[0])
//   }

//   return false
// }

// export function obfuscate(args:ObfuscateArgs) {

//   if (typeof args.object !== 'object') {
//     return args.object
//   }

//   let isCircular = false
//   try {
//     JSON.stringify(args)
//   } catch (e) {
//     isCircular = true
//   }

//   if (isCircular) {
//     try {
//       delete args.keys
//       delete args.values
//     } catch (e) {
//       // do nothing
//     }
//     return { ...args, WARNING: 'Circular reference detected' }
//   } else {
//     let newObj = { ...args.object }
//     const isKeySensitive = (data) => args.keys.some(k => match(k, data.key, 'key'))
//     const isValueSensitive = (data) => args.values.some(k => match(k, data.value, 'value'))
//     traverse(args.object, (data) => {
//       if (isKeySensitive(data) || isValueSensitive(data)) {
//         newObj = deepMerge(newObj, deepSet([data.path.join('.'), '[Obfuscated]']))
//       }
//     })
//     return newObj
//   }
// }

function removeKey(obj, key) {
  if (obj?.hasOwnProperty(key)) {
    obj[key] = '[secret]'
  }
  for (const subObj in obj) {
    if (typeof obj[subObj] == 'object') {
      removeKey(obj[subObj], key)
    }
  }
}

function removeValue(obj, value) {
  for (const subObj in obj) {
    const isString = typeof obj[subObj] == 'string'
    if (isString) {
      const isRegex = value instanceof RegExp
      const match = isRegex ? value.test(obj[subObj]) : obj[subObj].includes(value)
      if (match) {
        if (obj[subObj].startsWith('http')) {
          const url = parse(obj[subObj])
          obj[subObj] = `${url.origin}${url.pathname}/[secret]`
        } else {
          obj[subObj] = '[secret]'
        }
      }
    }
    if (typeof obj[subObj] == 'object') {
      removeValue(obj[subObj], value)
    }
  }
}

export function obfuscate(args:ObfuscateArgs) {
  const { object, keys, values } = args

  let isCircular = false
  try {
    JSON.stringify(args)
  } catch (e) {
    isCircular = true
  }

  if (typeof object === 'object' && !isCircular) {
    let cleanData = {}
    try {
      cleanData = cloneDeep(object)
      keys.forEach(fieldName => removeKey(cleanData, fieldName))
      values.forEach(fieldName => removeValue(cleanData, fieldName))
    } catch (err1) {
      try {
        cleanData = inspect(object, { depth: 1 })
      } catch (err2) {
        cleanData = { value: `Couldn't process data` }
      }
    }
    const result = cleanData
    return result
  } else {
    if (isCircular) {
      return { ...args.object, WARNING: 'Circular reference detected' }
    } else {
      return args.object
    }
  }
}

