/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-imports */
import { CSSProperties } from "react";
import { spacingVariants, SpacingVariants } from "./types";

export type SpacingFunction = (multiplier: number | string) => any;

export type Spacings<T extends string> = {
  [Property in SpacingVariants as `${T}${string & Property}`]: SpacingFunction;
} & {
  [Property in T]: (multiplier: number) => CSSProperties;
} & {
  value: (multiplier?: number) => number;
};

export function spacingFactory<T extends string>(
  base: number,
  property: T
): Spacings<T> {
  const functions = spacingVariants.map((v) => [
    `${property}${v}`,
    (n: number | string) => {
      const value = typeof n === "string" ? n : base * n;
      switch (v) {
        case "Horizontal":
          return {
            [`${property}Left`]: value,
            [`${property}Right`]: value,
          };
        case "Vertical":
          return {
            [`${property}Top`]: value,
            [`${property}Bottom`]: value,
          };
        case "":
          return {
            [`${property}Top`]: value,
            [`${property}Left`]: value,
            [`${property}Right`]: value,
            [`${property}Bottom`]: value,
          };
        default:
          return {
            [`${property}${v}`]: value,
          };
      }
    },
  ]);

  return {
    [`${property}`]: (n: number | string) => ({
      [`${property}`]: typeof n === "string" ? n : base * n,
    }),
    value: (n = 1) => base * n,
    ...Object.fromEntries(functions),
  };
}
