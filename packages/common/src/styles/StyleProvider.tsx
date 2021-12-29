import React, { createContext, useContext } from 'react'
import { DefaultVariants, DEFAULT_VARIANTS, VariantProvider } from '.'
import { ComponentVariants } from '..'
import { StyleContextProps, StyleContextValue } from './types'
import {Logger } from '../tools/Logger'
export const StyleContext = createContext({} as StyleContextValue<DefaultVariants>)
const silentLogger = new Logger({
  Logger: {
    Level: 'silent',
  },
})
export const StyleProvider = 
<S extends DefaultVariants, V extends VariantProvider<any, any>>({ children, variantProvider, variants, logger }:StyleContextProps<S, V>) => {

  return (
    <StyleContext.Provider
      value={{
        Theme: variantProvider.theme,
        ComponentVariants: variants,
        provider: variantProvider,
        logger: logger || silentLogger,
      }}
    >
      {children}
    </StyleContext.Provider>
  )
}

export function useStyle() {
  return useContext(StyleContext)
}

type UseComponentStyleProps<
  ComponentName extends keyof DEFAULT_VARIANTS,
  C extends DefaultVariants[ComponentName] = DefaultVariants[ComponentName]
> = ComponentVariants<C> & {
  rootElement: keyof C[keyof C]
}

export function useComponentStyle< K extends keyof DEFAULT_VARIANTS >(componentName:K, props: UseComponentStyleProps<K>) {
  const { ComponentVariants: CV, provider } = useStyle()

  return provider.getStyles(CV[componentName], props.variants, props.rootElement, props.responsiveVariants)
}

