import { useMemo } from "react"
import type { Field } from "../lib"

export function useField<V, T extends Field<V, any, any>>(field: T, params: Parameters<T['use']>, defaultField: () => T): ReturnType<T['use']> {
  if (field) {
    return field.use(params?.[0], params?.[1]) as ReturnType<T['use']>
  }

  const tempField = useMemo(() => {
    return defaultField()
  }, [])

  return tempField.use(params[0], params?.[1]) as ReturnType<T['use']>
}