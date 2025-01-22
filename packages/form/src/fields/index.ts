import { createStateSlice, globalState } from "@codeleap/store";
import { fieldFactory } from "../lib/factories";
import { TextField } from "./text";
import { ListField } from "./list";

export const fields = {
  text: fieldFactory(TextField),
  list: fieldFactory(ListField)
}