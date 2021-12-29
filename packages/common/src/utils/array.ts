import { FunctionType } from '..'

type GetterFunction<T> = FunctionType<[T, number], string |number>|keyof T
export function objectFromArray<T, Getter extends GetterFunction<T>>(arr:T[], keyAccessor?: Getter):Record<string, T> {
  let getObjectKey = ((_, idx) => idx)

  if (keyAccessor) {
    switch (typeof keyAccessor) {
      case 'string':
        getObjectKey = (value) => value[keyAccessor]
        break
      case 'function':
        getObjectKey = keyAccessor
        break
    }
  }

  const indexedMap = arr.map((value, idx) => [getObjectKey(value, idx), value])

  return Object.fromEntries(indexedMap)

}

export function uniqueArrayByProperty<T, G extends GetterFunction<T>>(array:T[], getProperty:G) {
  return Object.values(objectFromArray(array, getProperty))
}
