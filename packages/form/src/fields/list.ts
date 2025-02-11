import { Field } from "../lib/Field"
import { FieldOptions, Validator } from "../types"

export type ListValidator<Val, R = any, Err = any> = Validator<Val[] | Val, R, Err>

type ListFieldOptions<T, Validate extends Validator<T | T[], any, any>> = FieldOptions<T, Validate> & {
  item: Field<T, Validate>
}

export class ListField<T, Validate extends ListValidator<T>> extends Field<T | T[], Validate> {
  _type = "LIST"

  constructor(options: ListFieldOptions<T[] | T, Validate>) {
    super({
      // @ts-ignore fix this
      validate: (v) => {
        if (!options.validate) return {
          isValid: true
        }

        for (const value of v as T[]) {
          const validation = options.validate?.(value, null)

          if (!validation.isValid) {
            return validation
          }
        }

        return {
          isValid: true
        }
      },
      ...options
    })
  }
}