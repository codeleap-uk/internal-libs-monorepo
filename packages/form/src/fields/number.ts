import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, Validator } from "../types"
import { zodValidator } from "../validators"

type VALUE = number

export type NumberValidator<R = any, Err = any> = Validator<VALUE, R, Err>

type NumberFieldOptions<Validate extends NumberValidator> = FieldOptions<VALUE, Validate> & {
  min?: number
  max?: number
}

export class NumberField<Validate extends NumberValidator> extends Field<number, Validate> {
  _type = "NUMBER"

  constructor(options: NumberFieldOptions<Validate>) {
    super({
      validate: zodValidator(z.number().min(0).max(100000)) as unknown as Validate,
      defaultValue: 0,
      min: 0,
      max: 100000,
      ...options
    })
  }
}