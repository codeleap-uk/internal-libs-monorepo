import React, { createContext, useContext } from 'react';
import {
  AppTheme,
  CommonVariantObject,
  DefaultVariantBuilder,
  DefaultVariants,
  DEFAULT_VARIANTS,
  FromVariantsBuilder,
  VariantProvider,
} from '.';
import { AnyFunction, ComponentVariants, NestedKeys, StylesOf } from '..';
import { StyleContextProps, StyleContextValue } from './types';
import { Logger } from '../tools/Logger';
export const StyleContext = createContext(
  {} as StyleContextValue<
    DefaultVariants & Record<string, CommonVariantObject<any>>
  >,
);
const silentLogger = new Logger({
  Logger: {
    Level: 'silent',
  },
});
export const StyleProvider = <
  S extends DefaultVariants,
  V extends VariantProvider<any, AppTheme>
>({
    children,
    variantProvider,
    variants,
    logger,
    settings,
  }: StyleContextProps<S, V>) => {
  return (
    <StyleContext.Provider
      value={{
        Theme: variantProvider.theme,
        ComponentVariants: variants,
        provider: variantProvider,
        logger: logger || silentLogger,
        Settings: settings,
      }}
    >
      {children}
    </StyleContext.Provider>
  );
};

export function useStyle() {
  return useContext(StyleContext);
}

type ComponentNameArg = keyof DEFAULT_VARIANTS;
type UseComponentStyleProps<
  ComponentName extends ComponentNameArg,
  C extends CommonVariantObject<any> = DefaultVariants[ComponentName]
> = ComponentVariants<C> & {
  rootElement?: keyof C[keyof C];
  styles?: StylesOf;
  transform?: AnyFunction;
};

export function useComponentStyle<
  K extends ComponentNameArg | `u:${string}`,
  S extends DefaultVariantBuilder<any>
>(
  componentName: K,
  props: UseComponentStyleProps<K extends keyof DEFAULT_VARIANTS ? K : any>,
): K extends ComponentNameArg
  ? Record<NestedKeys<DefaultVariants[K]>, any>
  : Record<NestedKeys<FromVariantsBuilder<any, S>>, any> {
  const { ComponentVariants: CV, provider } = useStyle() || {};

  const styles = props?.transform
    ? Object.fromEntries(
      Object.entries(props?.styles || {}).map(([key, value]) => [
        key,
        props.transform(value),
      ]),
    )
    : props.styles;
  let name = componentName as string;

  if (componentName.startsWith('u:')) {
    name = componentName.replace('u:', '');
  }

  const v = CV?.[name];
  if (!v) {
    throw new Error(
      `Could not read context stylesheets for ${name}. Ensure it's being passed to <StyleProvider /> in the variants  prop.`,
    );
  }

  const stylesheet = provider.getStyles(v, {
    variants: props.variants || [],
    responsiveVariants: props.responsiveVariants || {},
    rootElement: props.rootElement,
    styles,
  });

  return stylesheet as any;
}
