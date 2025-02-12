import { TextField, TextValidator } from "@codeleap/form/src/fields/text"
import { TextInput, TextInputProps } from "../TextInput"
import { useRef } from "react"

type TextFieldProps<Validate extends TextValidator> = {
  field: TextField<Validate>
} & TextInputProps

export function TextFieldInput<Validate extends TextValidator>(props: TextFieldProps<Validate>) {

  const { field, ...rest } = props

  const inputRef = useRef<HTMLInputElement>()

  const state = field.use({
    blur() {
      inputRef.current?.blur()
    },
    focus() {
      inputRef.current?.focus()
    },
    async scrollIntoView() {
      window.scrollTo({
        top: inputRef.current.getBoundingClientRect().top
      })
    },
    getValue() {
      return inputRef.current.value
    },
  })

  return <TextInput 
    {...rest}
    value={state.value}
    onChangeText={state.setValue}

  />
}