import { PartialComponentStyle } from './types'

import { FunctionType } from '../../types'
import { ThemeColorScheme } from '.'
import { AppTheme } from '..'

type CreateVariantOptions = {
  dynamic?: boolean;
};
const defaultOptions: CreateVariantOptions = {
  dynamic: false,
}

export function createDefaultVariantFactory<
  Composition extends string,
  VT = PartialComponentStyle<Composition, any>
>() {
  function createVariant(
    builder: FunctionType<[ThemeColorScheme<AppTheme>, string], VT>,
    options = defaultOptions,
  ) {
    if (options.dynamic) {
      return (() => builder) as unknown as (
        theme: ThemeColorScheme<AppTheme>,
        variant?: string
      ) => VT 
    }

    return builder
  }

  return createVariant
}
