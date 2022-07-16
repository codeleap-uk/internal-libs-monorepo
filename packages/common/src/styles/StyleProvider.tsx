import React, { createContext, useContext, useMemo, useState } from 'react'
import {
  AppTheme,
  CommonVariantObject,
  DefaultVariantBuilder,
  DefaultVariants,
  DEFAULT_VARIANTS,
  EnhancedTheme,
  FromVariantsBuilder,
  VariantProvider,
} from '.'
import { AnyFunction, ComponentVariants, FunctionType, NestedKeys, StylesOf } from '..'
import { silentLogger } from '../constants'
import { onMount } from '../utils'
import { StyleContextProps, StyleContextValue } from './types'

export const StyleContext = createContext(
  {} as StyleContextValue<
    Record<string, DefaultVariantBuilder>
  >,
)

export const StyleProvider = <
  S extends Readonly<Record<string, DefaultVariantBuilder>>,
  V extends VariantProvider<any, AppTheme>
>({
    children,
    variantProvider,
    variants,
    logger,
    settings,
  }: StyleContextProps<S, V>) => {
  const [theme, setTheme] = useState(variantProvider.theme.theme)

  onMount(() => {
    variantProvider.onColorSchemeChange((t) => {
      setTheme(t.theme as string)
    })

  })

  return (
    <StyleContext.Provider
      value={{
        Theme: variantProvider.theme,
        currentTheme: theme,
        ComponentVariants: variants,
        provider: variantProvider,
        logger: logger || silentLogger,
        Settings: settings,
      }}
    >
      {children}
    </StyleContext.Provider>
  )
}

export function useCodeleapContext() {
  return useContext(StyleContext)
}

type ComponentNameArg = keyof DEFAULT_VARIANTS
type useDefaultComponentStyleProps<
  ComponentName extends ComponentNameArg,
  C extends CommonVariantObject<any> = DefaultVariants[ComponentName],
  Comp extends NestedKeys<FromVariantsBuilder<any, DEFAULT_VARIANTS[ComponentName]>> = NestedKeys<FromVariantsBuilder<any, DEFAULT_VARIANTS[ComponentName]>>
> = ComponentVariants<C> & {
  rootElement?: Comp
  styles?: StylesOf<Comp>
  transform?: AnyFunction
}

export function useDefaultComponentStyle<
  K extends ComponentNameArg | `u:${string}`,
  S extends DefaultVariantBuilder<any>
>(
  componentName: K,
  props: useDefaultComponentStyleProps<K extends keyof DEFAULT_VARIANTS ? K : any>,
): K extends ComponentNameArg
  ? Record<NestedKeys<FromVariantsBuilder<any, DEFAULT_VARIANTS[K]>>, any>
  : Record<NestedKeys<FromVariantsBuilder<any, S>>, any> {
  const { ComponentVariants: CV, provider, currentTheme } = useCodeleapContext() || {}
  try {

    const styles = props?.transform
      ? Object.fromEntries(
        Object.entries(props?.styles || {}).map(([key, value]) => [
          key,
          props.transform(value),
        ]),
      )
      : props.styles
    let name = componentName as string

    if (componentName.startsWith('u:')) {
      name = componentName.replace('u:', '')
    }

    const v = CV?.[name]
    if (!v) {
      throw new Error(
        `Could not read context stylesheets for ${name}. Ensure it's being passed to <StyleProvider /> in the variants  prop.`,
      )
    }

    const stylesheet = useMemo(() => provider.getStyles(v, {
      // @ts-ignore
      variants: props.variants || [],
      // @ts-ignore
      responsiveVariants: props.responsiveVariants || {},
      rootElement: props.rootElement,
      styles,
    }, currentTheme as string), [props.variants, props.responsiveVariants, props.rootElement, styles, componentName])
    return stylesheet as any
  } catch (e) {
    throw new Error('useDefaultComponentStyle with args ' + arguments + e)
  }
}

export function useComponentStyle<T extends FunctionType<[EnhancedTheme<any>], any>>(styler:T):ReturnType<T> {
  const { currentTheme, provider } = useCodeleapContext()
  try {

    const styles = useMemo(() => styler(provider.withColorScheme(currentTheme as string)), [currentTheme])

    return styles
  } catch (e) {
    throw new Error(`useComponentStyle with args ${arguments} ${e}`)
  }
}
