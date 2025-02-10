import { Field } from "../lib/Field";
import {z} from 'zod'
import { FieldOptions, Validator } from "../types";
import { zodValidator } from "../validators";



export type ListValidator<Val, R = any, Err = any> = Validator<Val[], R, Err>

type ListFieldOptions<T , Validate extends Validator<T, any, any>> = FieldOptions<T[], Validate> & {
  item: Field<T, Validate>
}

export class ListField<T, Validate extends ListValidator<T>> extends Field<T[], Validate> {
  _type = "LIST"

  constructor(options: ListFieldOptions<T, Validate>) {
    super({
      validate: (v) => {
        if(!options.validate) return {
          isValid: true
        }

        for(const value of v){
          const validation = options.validate?.(value, null)

          if(!validation.isValid){
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



 


 

