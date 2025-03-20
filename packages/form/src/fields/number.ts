import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, Validator } from "../types"
import { zodValidator } from "../validators"

export type NumberValidator<R = any, Err = any> = Validator<number | number[], R, Err>

type Props = {
  min?: number
  max?: number
}

type NumberFieldOptions<Validate extends NumberValidator> = FieldOptions<number | number[], Validate> & Props

const MAX_VALID_DIGITS = 1000000000000000 // maximum number of digits that the input supports to perform operations

export class NumberField<Validate extends NumberValidator> extends Field<number | number[], Validate> {
  _type = "NUMBER"

  constructor(options: NumberFieldOptions<Validate>) {
    const { min = 0, max = MAX_VALID_DIGITS, defaultValue, ...others } = options

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