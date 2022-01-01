import { PartialComponentStyle } from '.'
import { EnhancedTheme } from '..'
import {  FunctionType } from '../..'

type CreateVariantOptions = {
  dynamic?:boolean
}
const defaultOptions:CreateVariantOptions = {
  dynamic: false,
}

export function createDefaultVariantFactory<Composition extends string, VT = PartialComponentStyle<Composition, any>>() {
  function createVariant(builder: FunctionType<[EnhancedTheme, string], VT>, options = defaultOptions  ) {
    if (options.dynamic) return (() => builder ) as unknown as ((theme: EnhancedTheme, variant?: string) => VT)
   
    return (theme: EnhancedTheme, variant?:string) => builder(theme, variant)

    


  }

  return createVariant
}
