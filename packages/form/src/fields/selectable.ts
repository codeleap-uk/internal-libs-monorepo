import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, IFieldRef, Validator } from "../types"
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

  items = []

  constructor(options: SelectableFieldOptions<V, Validate>) {
    super({
      validate: zodValidator(z.null()) as unknown as Validate,
      ...options
    })

    this.items = options.options
  }

  use(impl?: Partial<IFieldRef<V>>, deps?: any[]){
    const value = this.useValue()    

    const validation = this.useValidation()
    
    // Yes, this is dangerous and doesn't follow the rules, but not passing an implementation to imperative handle after passing it once would break the app anyway
    if(impl) { 
      this.useBinding(impl, deps)
    }
    
    const changed = value != this.initialValue

    return {
      validation,
      value,
      setValue: this.setValue,
      changed,
      representation: this.toRepresentation(value),
      options: this.options,
      items: this.items,
    }
  }
}