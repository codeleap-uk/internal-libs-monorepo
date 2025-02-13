import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, Validator } from "../types"
import { zodValidator } from "../validators"

export type DateValidator<R = any, Err = any> = Validator<Date, R, Err>

type DateFieldOptions<Validate extends DateValidator> = FieldOptions<Date, Validate> & {
  minimumDate?: Date
  maximumDate?: Date
}

export class DateField<Validate extends DateValidator> extends Field<Date, Validate> {
  _type = "DATE"

  constructor(options: DateFieldOptions<Validate>) {
    super({
      validate: zodValidator(z.date()) as unknown as Validate,
      ...options
    })
  }
}