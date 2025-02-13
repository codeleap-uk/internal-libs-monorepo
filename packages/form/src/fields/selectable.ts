import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, Validator } from "../types"
import { zodValidator } from "../validators"
import { Options } from '@codeleap/types'

type VALUE = string | number

export type SelectableValidator<V extends VALUE, R = any, Err = any> = Validator<V, R, Err>

type SelectableFieldOptions<V extends VALUE, Validate extends SelectableValidator<V>> = FieldOptions<V, Validate> & {
  options: Options<V>
}

export class SelectableField<V extends VALUE, Validate extends SelectableValidator<V>> extends Field<V, Validate> {
  _type = "SELECTABLE"

  constructor(options: SelectableFieldOptions<V, Validate>) {
    super({
      validate: zodValidator(z.string().or(z.number())) as unknown as Validate,
      ...options
    })
  }
}