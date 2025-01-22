import { Field } from "../lib/Field";
import {z} from 'zod'
import { FieldOptions, Validator } from "../newtypes";
import { zodValidator } from "../validators";

type VALUE = string

export type TextValidator<R = any, Err = any> = Validator<VALUE, R, Err>

type TextFieldOptions<Validate extends TextValidator> = FieldOptions<VALUE, Validate>  


export class TextField<Validate extends TextValidator> extends Field<string, Validate> {
  _type = "TEXT"

  constructor(options: TextFieldOptions<Validate>) {
    super({
      validate: zodValidator(z.string()),
      ...options
    })
  }
}



 


 

