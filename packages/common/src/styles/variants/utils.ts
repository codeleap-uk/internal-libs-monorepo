/* eslint-disable max-len */
import { CSSProperties } from 'react'
import { VariantProp } from '.'
import { EnhancedTheme} from '..'
import { deepMerge } from '../../utils/object'
import {
  ApplyVariantsArgs,
  DefaultVariantBuilder,
  FromVariantsBuilder, 
} from './types'

export function mapVariants<S = CSSProperties, 
T extends DefaultVariantBuilder<S> = DefaultVariantBuilder<S>>
(theme: EnhancedTheme<any>, variantsObject:  T) {
  const thisComponentVariants = {} as FromVariantsBuilder<S, T>

  for (const [variantName, variantBuilder] of Object.entries(variantsObject)) {
    
    thisComponentVariants[variantName as keyof T] = variantBuilder(theme, variantName) as ReturnType<T[keyof T]>
      
    
  }
  
  return thisComponentVariants
}

export function standardizeVariants(variants:VariantProp<any>):string[] {
  let variantList = []
  if (typeof variants === 'string') {
    variantList = variants.split(' ')
  } else {
    variantList = [...(variants||[])]
  }
  return variantList
}

const directions = ['Top', 'Right', 'Bottom', 'Left', 'Horizontal', 'Vertical', 'l', 'r', 't', 'b', 'h', 'v']

const SPACING_VARIANTS = ['m', 'margin', 'mt', 'marginTop', 'mr', 'marginRight', 'mb', 'marginBottom', 'ml', 'marginLeft', 'mh', 'marginHorizontal', 'mv', 'marginVertical', 'p', 'padding', 'pt', 'paddingTop', 'pr', 'paddingRight', 'pb', 'paddingBottom', 'pl', 'paddingLeft', 'ph', 'paddingHorizontal', 'pv', 'paddingVertical']

export function applyVariants({ computedStyles, rootElement = 'wrapper', styles, theme, variantName }:ApplyVariantsArgs) {
  if (!styles[variantName]) {

    if (SPACING_VARIANTS.includes(variantName)) {

      const [spacingFunction, multiplier] = variantName.split(':')
      let arg:number|string = Number(multiplier)
      if (Number.isNaN(arg)){
        arg = multiplier
      }
      return deepMerge(computedStyles, {
        [rootElement]: {
          ...theme.spacing[spacingFunction](arg),
        },
      })
    } else if (variantName.startsWith('d:') && styles.dynamicHandler){
   
      return deepMerge(computedStyles, styles.dynamicHandler(theme, variantName.replace('d:', '')))
    }

    return computedStyles
  } else {
    return deepMerge(computedStyles, styles[variantName])
  }
}


