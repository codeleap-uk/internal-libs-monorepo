import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, Validator } from "../types"
import { zodValidator } from "../validators"

type VALUE<T> = T | Array<T> 

export type MultiValidator<V, R = any, Err = any> = Validator<VALUE<V>, R, Err>

type MultiFieldOptions<V, Validate extends MultiValidator<V>> = FieldOptions<VALUE<V>, Validate>

export class MultiField<V, Validate extends MultiValidator<V>> extends Field<VALUE<V>, Validate> {
  _type = "MULTI"

  constructor(options: MultiFieldOptions<V, Validate>) {
    super({
      validate: zodValidator(z.null()) as unknown as Validate,
      ...options
    })
  }
}