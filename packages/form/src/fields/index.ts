import { createStateSlice, globalState } from "@codeleap/store";
import { fieldFactory } from "../lib/factories";
import { TextField } from "./text";

export const fields = {
  text: fieldFactory(TextField)
}