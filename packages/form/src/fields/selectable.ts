import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, Validator } from "../types"
import { zodValidator } from "../validators"

type VALUE = string | number

export type SelectableValidator<V extends VALUE, R = any, Err = any> = Validator<V, R, Err>

type Option<V extends VALUE> = {
  value: V
  label: string
  disabled?: boolean
}

type SelectableFieldOptions<V extends VALUE, Validate extends SelectableValidator<V>> = FieldOptions<V, Validate> & {
  options: Option<V>[]
}

export class SelectableField<V extends VALUE, Validate extends SelectableValidator<V>> extends Field<V, Validate> {
  _type = "SELECTABLE"

  items = [] as Option<V>[]

  constructor(options: SelectableFieldOptions<V, Validate>) {
    super({
      validate: zodValidator(z.null()) as unknown as Validate,
      ...options
    })

    this.items = options.options
  }

  getProps() {
    return {
      items: this.items,
    }
  }
}