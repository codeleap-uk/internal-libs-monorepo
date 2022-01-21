import { StyleProp } from "react-native";

export type StylesOf<C extends string> = Partial<Record<C, StyleProp<any>> >