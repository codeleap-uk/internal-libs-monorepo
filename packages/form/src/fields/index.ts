import { fieldFactory } from "../lib/factories"
import { TextField } from "./text"
import { ListField } from "./list"
import { NumberField } from "./number"
import { BooleanField } from "./bool"
import { SelectableField } from "./selectable"
import { MultiField } from "./multi"

export const fields = {
  text: fieldFactory(TextField),
  list: fieldFactory(ListField),
  number: fieldFactory(NumberField),
  boolean: fieldFactory(BooleanField),
  selectable: fieldFactory(SelectableField),
  multi: fieldFactory(MultiField),
}

export {
  TextField,
  ListField,
  NumberField,
  BooleanField,
  SelectableField,
  MultiField,
}