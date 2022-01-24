import { PartialComponentStyle } from './types'
import { EnhancedTheme } from '../types'
import {  FunctionType } from '../../types'

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
