import { Field } from "../lib/Field"
import { z } from 'zod'
import { FieldOptions, Validator } from "../types"
import { zodValidator } from "../validators"

export type FileValidator<R = any, Err = any> = Validator<any, R, Err>

type FileFieldOptions<Validate extends FileValidator> = FieldOptions<any, Validate>

export class FileField<Validate extends FileValidator> extends Field<any, Validate> {
  _type = "FILE"

  constructor(options: FileFieldOptions<Validate>) {
    super({
      validate: zodValidator(z.any()) as unknown as Validate,
      ...options
    })
  }
}