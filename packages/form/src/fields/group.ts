import { Field } from "../lib/Field";
import {z} from 'zod'
import { FieldOptions, Validator } from "../newtypes";
import { zodValidator } from "../validators";

type VALUE = string

type GroupValidator<R = any, Err = any> = Validator<VALUE, R, Err>

type GroupFieldOptions<Validate extends GroupValidator> = FieldOptions<VALUE, Validate>  


export class GroupField<Validate extends GroupValidator> extends Field<string, Validate> {
  _type = "group"

  constructor(options: GroupFieldOptions<Validate>) {
    super({
      validate: zodValidator(z.string()),
      ...options
    })
  }
}



 


 

