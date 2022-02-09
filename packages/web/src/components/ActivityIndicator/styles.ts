import {
  ActivityIndicatorComposition,
  ActivityIndicatorStyles,
  createDefaultVariantFactory,
} from "@codeleap/common";

const createActivityIndicatorStyle =
  createDefaultVariantFactory<ActivityIndicatorComposition>();

const getDefault = ActivityIndicatorStyles.default;

export const WebActivityIndicatorStyles = {
  ...ActivityIndicatorStyles,
  default: createActivityIndicatorStyle((theme) => {
    const defaults = getDefault(theme);
    return defaults;
  }),
};
