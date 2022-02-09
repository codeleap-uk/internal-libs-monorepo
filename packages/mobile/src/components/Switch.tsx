import * as React from "react";
import {
  SwitchStyles,
  SwitchComposition,
  ComponentVariants,
  useComponentStyle,
  StylesOf,
  useStyle,
  FormTypes,
  useValidate,
} from "@codeleap/common";
import { ComponentPropsWithRef, forwardRef, ReactNode } from "react";
import { StyleSheet, Switch as NativeSwitch } from "react-native";
import { InputLabel, FormError } from "./TextInput";
import { View } from "./View";

type NativeSwitchProps = Omit<
  ComponentPropsWithRef<typeof NativeSwitch>,
  "thumbColor" | "trackColor"
>;
type SwitchProps = NativeSwitchProps & {
  variants?: ComponentVariants<typeof SwitchStyles>["variants"];
  label?: ReactNode;
  styles?: StylesOf<SwitchComposition>;
  validate?: FormTypes.ValidatorFunctionWithoutForm | string;
};

export const Switch = forwardRef<NativeSwitch, SwitchProps>(
  (switchProps, ref) => {
    const {
      variants = [],
      style = {},
      styles = {},
      validate,
      label,
      value,
      ...props
    } = switchProps;

    const variantStyles = useComponentStyle("Switch", {
      variants,
    });
    const { error, showError } = useValidate(switchProps.value, validate);
    function getStyles(key: SwitchComposition) {
      return [
        variantStyles[key],
        styles[key],
        key === "wrapper" ? style : {},
        showError ? variantStyles[key + ":error"] : {},
        showError ? styles[key + ":error"] : {},
        value ? variantStyles[key + ":on"] : {},
        value ? styles[key + ":on"] : {},
        switchProps.disabled ? variantStyles[key + ":disabled"] : {},
        switchProps.disabled ? styles[key + ":disabled"] : {},
      ];
    }

    const inputStyles = getStyles("input");

    const { color, backgroundColor } = StyleSheet.flatten(inputStyles);
    const { Theme } = useStyle();

    const thumbColor = color || Theme.colors.primary;
    const trackColor = backgroundColor || Theme.colors.gray;
    return (
      <View style={getStyles("wrapper")}>
        <View style={getStyles("inputWrapper")}>
          <NativeSwitch
            thumbColor={thumbColor}
            trackColor={{ false: trackColor, true: trackColor }}
            ios_backgroundColor={trackColor}
            value={value}
            {...props}
          />
          <InputLabel label={label} style={getStyles("label")} />
        </View>
        <FormError message={error.message} style={getStyles("error")} />
      </View>
    );
  }
);
