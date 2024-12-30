 
import { FormDef, Validator } from "../newtypes"
import { Field } from "./Field"

type FieldBuilder<T, Validate extends Validator<any,any,any>> = typeof Field<T, Validate>

export function fieldFactory<
  T extends FieldBuilder<any,any>, 
  Value = T extends FieldBuilder<infer V, any> ? V : never, 
  Validator = T extends FieldBuilder<infer VL, any> ? VL : never,
>(cls: T) {
  return <A extends ConstructorParameters<T>[0]>(options?: A): Field<Value, A['validate']>  => {
    
    // @ts-expect-error
    return new cls(options ?? {})
  }
}

 