import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, Validator } from "../types"
import { zodValidator } from "../validators"

export type DateValidator<R = any, Err = any> = Validator<Date, R, Err>

type Props = {
  minimumDate?: Date
  maximumDate?: Date
}

type DateFieldOptions<Validate extends DateValidator> = FieldOptions<Date, Validate> & Props

export class DateField<Validate extends DateValidator> extends Field<Date, Validate> {
  _type = "DATE"

  properties = {} as Props

  constructor(options: DateFieldOptions<Validate>) {
    const { maximumDate, minimumDate, ...others } = options

    super({
      validate: zodValidator(z.date()) as unknown as Validate,
      ...others
    } as DateFieldOptions<Validate>)

    this.properties = {
      minimumDate,
      maximumDate,
    }
  }

  getProps() {
    return this.properties
  }
}