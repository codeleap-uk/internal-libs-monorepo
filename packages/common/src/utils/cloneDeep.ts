export function cloneDeep(value) {
  if (value === null || typeof value !== 'object') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(cloneDeep)
  }

  if (value instanceof Date) {
    return new Date(value.getTime())
  }

  if (value instanceof Map) {
    const clonedMap = new Map()
    value.forEach((v, k) => {
      clonedMap.set(k, cloneDeep(v))
    })
    return clonedMap
  }

  if (value instanceof Set) {
    const clonedSet = new Set()
    value.forEach((v) => {
      clonedSet.add(cloneDeep(v))
    })
    return clonedSet
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags)
  }

  const clonedObj = {}

  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      clonedObj[key] = cloneDeep(value[key])
    }
  }

  return clonedObj
}
