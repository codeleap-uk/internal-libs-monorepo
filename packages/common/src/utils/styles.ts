import * as TypeGuards from "./typeGuards"
import {DefaultVariantBuilder} from '../styles/variants/types'
import { deepMerge } from "./object"
import { capitalize } from "lodash"


type WithPrefixedCompositionOptions<Prefix extends string, VariantObject extends DefaultVariantBuilder> = {
    prefix: Prefix,
    variantObject: VariantObject,
    variants: keyof VariantObject | (keyof VariantObject)[]
    theme: Parameters<VariantObject[keyof VariantObject]>[0]
}

type WithPrefixedCompositionReturn<Prefix extends string, VariantObject extends DefaultVariantBuilder> = {
    [Property in InferComposition<VariantObject> as `${Prefix}${Capitalize<Property&string>}`]: string
}

type InferComposition<T extends DefaultVariantBuilder> = keyof ReturnType<
    T[keyof T]
>

export function withPrefixedComposition<Prefix extends string, VariantObject extends DefaultVariantBuilder>(
    options: WithPrefixedCompositionOptions<Prefix, VariantObject>
): WithPrefixedCompositionReturn<Prefix, VariantObject> {
    const variants = TypeGuards.isString(options.variants) ? [options.variants] : options.variants as string[]
    let styles = {} 

    for(const variant of variants){
        const variantStyle = options.variantObject[variant](options.theme, '')
        const prefixedVariantStyle = Object.fromEntries(
            Object.entries(variantStyle).map(([k,v]) => {
                return [
                    `${options.prefix}${capitalize(k)}`,
                    v
                ]
            })
            
            )

        styles = deepMerge(styles, prefixedVariantStyle)
    }
    
    return styles as WithPrefixedCompositionReturn<Prefix, VariantObject>
}
