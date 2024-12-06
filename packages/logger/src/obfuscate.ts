import { cloneDeep } from '@codeleap/common'
import { FunctionType } from '@codeleap/types'
import { inspect } from 'util'
import parse from 'url-parse'

export type Matcher<T> = string | Partial<RegExp> | FunctionType<[valueOrKey: any, type: T], boolean>

type ObfuscateArgs = {
  object: any
  keys: (Matcher<'key'>)[]
  values: (Matcher<'value'>)[]
}

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

export function obfuscate(args: ObfuscateArgs) {
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
