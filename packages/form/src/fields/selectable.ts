import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, Validator } from "../types"
import { zodValidator } from "../validators"
import { Options } from '@codeleap/types'

type VALUE = string | number

export type SelectableValidator<V extends VALUE, R = any, Err = any> = Validator<V, R, Err>

type SelectableFieldOptions<V extends VALUE, Validate extends SelectableValidator<V>> = FieldOptions<V, Validate> & {
  options: Options<V>
  minItems?: number
  maxItems?: number
}

export class SelectableField<V extends VALUE, Validate extends SelectableValidator<V>> extends Field<V, Validate> {
  _type = "SELECTABLE"

  constructor(options: SelectableFieldOptions<V, Validate>) {
    const { minItems = 1, maxItems = options?.options?.length } = options
    
    const zScheme = z.string().or(z.number())

    super({
      validate: zodValidator(z.array(zScheme).min(minItems).max(maxItems).or(zScheme)) as unknown as Validate,
      minItems,
      maxItems,
      ...options,
    })
  }
}