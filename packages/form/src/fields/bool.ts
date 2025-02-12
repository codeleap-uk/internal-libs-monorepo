import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, Validator } from "../types"
import { zodValidator } from "../validators"

type VALUE = boolean

export type BooleanValidator<R = any, Err = any> = Validator<VALUE, R, Err>

type BooleanFieldOptions<Validate extends BooleanValidator> = FieldOptions<VALUE, Validate>

export class BooleanField<Validate extends BooleanValidator> extends Field<boolean, Validate> {
  _type = "NUMBER"

  constructor(options: BooleanFieldOptions<Validate>) {
    super({
      validate: zodValidator(z.boolean()) as unknown as Validate,
      ...options
    })
  }
}