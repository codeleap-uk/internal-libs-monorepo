import { fieldFactory } from "../lib/factories"
import { TextField } from "./text"
import { ListField } from "./list"
import { NumberField } from "./number"
import { BooleanField } from "./bool"
import { SelectableField } from "./selectable"
import { DateField } from "./date"
import { FileField } from "./file"

export const fields = {
  text: fieldFactory(TextField),
  list: fieldFactory(ListField),
  number: fieldFactory(NumberField),
  boolean: fieldFactory(BooleanField),
  selectable: fieldFactory(SelectableField),
  date: fieldFactory(DateField),
  file: fieldFactory(FileField),
}

export {
  TextField,
  ListField,
  NumberField,
  BooleanField,
  SelectableField,
  DateField,
  FileField,
}