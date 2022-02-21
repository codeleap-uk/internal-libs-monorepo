import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults'

export type ActivityIndicatorComposition =
  | 'wrapper'
  | 'backCircle'
  | 'frontCircle'
  | 'circle';

const createActivityIndicatorStyle =
  createDefaultVariantFactory<ActivityIndicatorComposition>()

const presets = includePresets((styles) => createActivityIndicatorStyle(() => ({ wrapper: styles })),
)


export const getActivityIndicatorBaseStyles = (size:number) => {
  const sizes = {
    height: size,
    width: size,
    borderWidth: size  * 0.25,
  }

  return {
    wrapper: {
      position: 'relative',
      ...sizes,
    } as any,
    circle: {
      borderRadius: 100,
      position: 'absolute',
      borderStyle: 'solid',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    } as any,
    backCircle: {
      
      // borderColor: theme.colors.primary,
      minWidth: '100%',
      opacity: 0.5, 
    } as any,
    frontCircle: {
      position: 'absolute',
      borderColor: 'transparent',
      // borderTopColor: theme.colors.primary,
    } as any,
  }
}

export const ActivityIndicatorStyles = {
  ...presets,
  default: createActivityIndicatorStyle((theme) => {
    const baseStyles = getActivityIndicatorBaseStyles(35)

    return {
      ...baseStyles,
      backCircle: {
        ...baseStyles.backCircle,
        borderColor: theme.colors.primary,
      },
      frontCircle: {
        ...baseStyles.frontCircle,
        borderTopColor: theme.colors.primary,
      },
    }

    
  }),
}
