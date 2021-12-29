import { PartialComponentStyle } from '.'
import { EnhancedTheme } from '..'
import { AnyFunction, FunctionType } from '../..'

export function createDefaultVariantFactory<Composition extends string, VT = PartialComponentStyle<Composition, any>>() {
  function createVariant(builder: FunctionType<[EnhancedTheme], VT>) {
    return (theme: EnhancedTheme) => builder(theme)
  }

  return createVariant
}
