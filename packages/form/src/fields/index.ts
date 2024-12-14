import { createStateSlice, globalState } from "@codeleap/store";
import { fieldFactory } from "../lib/fieldFactory";
import { TextField } from "./text";

export const fields = {
  text: fieldFactory(TextField)
}