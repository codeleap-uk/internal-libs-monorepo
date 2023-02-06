import { createDefaultVariantFactory, shadeColor } from "@codeleap/common"
import { ActivityIndicatorComposition } from "../ActivityIndicator"

type WrapperStates = 'hidden'| 'visible' 

export type LoadingOverlayComposition = 'wrapper' | `wrapper:${WrapperStates}` | 'wrapper:transition' | `loader${Capitalize<ActivityIndicatorComposition>}` 

const createLoadingOverlayStyle = createDefaultVariantFactory<LoadingOverlayComposition>()

export const LoadingOverlayStyles = {
    default: createLoadingOverlayStyle(theme => ({
        wrapper: {
            ...theme.presets.center,
            ...theme.presets.whole,
            ...theme.presets.absolute,
            backgroundColor: theme.colors.background
        },
        'wrapper:visible': {
            opacity: 1  
        },
        'wrapper:hidden': {
            opacity: 0   
        },
        'wrapper:transition': {
            opacity: {
                duration: 900,
                type: 'timing',
            },

        }
    }))
}