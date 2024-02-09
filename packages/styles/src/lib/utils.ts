
export function capitalize(str: string, reverse = false) {
  if (!str.length) return str
  const firstChar = reverse ? str[0].toLowerCase() : str[0].toUpperCase()
  return firstChar + str.substring(1)
}

export function objectPickBy<K extends string = string, P = any>(obj: Record<K, P>, predicate: (valueKey: P, key: K) => boolean) {
  const result = {} as Record<K, P>

  for (const key in obj) {
    if (obj?.hasOwnProperty?.(key) && predicate?.(obj?.[key], key)) {
      result[key] = obj?.[key]
    }
  }

  return result
}
