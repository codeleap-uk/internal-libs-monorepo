import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, Validator } from "../types"
import { zodValidator } from "../validators"

export type NumberValidator<R = any, Err = any> = Validator<number | number[], R, Err>

type NumberFieldOptions<Validate extends NumberValidator> = FieldOptions<number | number[], Validate> & {
  min?: number
  max?: number
}

export class NumberField<Validate extends NumberValidator> extends Field<number | number[], Validate> {
  _type = "NUMBER"

  constructor(options: NumberFieldOptions<Validate>) {
    const { min = 0, max = 100000, defaultValue, ...others } = options

    const isMultiple = Array.isArray(defaultValue)

    const zScheme = z.number().min(min).max(max)

    super({
      validate: zodValidator(isMultiple ? z.array(zScheme) : zScheme) as unknown as Validate,
      min,
      max,
      defaultValue,
      ...others
    } as NumberFieldOptions<Validate>)
  }
}