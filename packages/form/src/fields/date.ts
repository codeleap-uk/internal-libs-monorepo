import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, Validator } from "../types"
import { zodValidator } from "../validators"
import dayjs from 'dayjs'

export type DateValidator<R = any, Err = any> = Validator<Date, R, Err>

type DateFieldOptions<Validate extends DateValidator> = FieldOptions<Date, Validate> & {
  minimumDate?: Date
  maximumDate?: Date
}

function normalizeToDate(val: unknown): Date | undefined {
  if (!val) return undefined

  if (val instanceof Date) return val
  if (dayjs.isDayjs(val)) return val.startOf('day').toDate()
  if (typeof val === 'string') {
    const parsed = dayjs(val)
    return parsed.isValid() ? parsed.startOf('day').toDate() : undefined
  }

  return undefined
}

export class DateField<Validate extends DateValidator> extends Field<Date, Validate> {
  _type = "DATE"

  constructor(options: DateFieldOptions<Validate>) {
    const { minimumDate, maximumDate, ...rest } = options

    const schema = z.preprocess((val: unknown) => {
      const normalized = normalizeToDate(val)

      if (!normalized || isNaN(normalized.getTime())) return undefined
      return normalized
    }, z.date()
      .refine(d => !minimumDate || d >= minimumDate, {
        message: `Date must be on or after ${minimumDate?.toDateString()}`,
      })
      .refine(d => !maximumDate || d <= maximumDate, {
        message: `Date must be on or before ${maximumDate?.toDateString()}`,
      })
    )

    super({
      validate: zodValidator(schema) as unknown as Validate,
      ...options,
    })
  }
}