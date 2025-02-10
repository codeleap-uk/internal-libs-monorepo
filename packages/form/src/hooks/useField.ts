import {   useMemo } from "react";
import type { Field } from "../lib";

export function useField<T extends Field<any,any,any>>(field: T, params: Parameters<T['use']>, defaultField: () => T) {
  if(field){
    return field.use(params?.[0], params?.[1])
  }

  const tempField = useMemo(() => {
    return defaultField()
  }, [])

  return tempField.use(params[0], params?.[1])  
}

