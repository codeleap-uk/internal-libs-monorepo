import { fieldFactory } from "../lib/factories"
import { TextField } from "./text"
import { ListField } from "./list"
import { NumberField } from "./number"

export const fields = {
  text: fieldFactory(TextField),
  list: fieldFactory(ListField),
  number: fieldFactory(NumberField),
}

export {
  TextField,
  ListField,
  NumberField,
}